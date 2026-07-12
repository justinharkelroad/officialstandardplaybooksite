// generate_theta_track — ported to the Standard Playbook member app.
// Auth: requireActiveMember replaces the source's verifyRequest + agency/tier
// gates; ownership via theta_targets.user_id. Model: eleven_multilingual_v2,
// mp3_44100_128, batched with retry; returns base64 segments plus
// background_track_url '21m.mp3' for client-side mixing.
// Reads ELEVEN_API_KEY.
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { requireActiveMember } from "../_shared/memberAuth.ts";
import {
  resolveSavedThetaAffirmations,
  thetaActorColumns,
  thetaRowBelongsToActor,
  validateThetaSessionId,
} from "../theta_audio_state/thetaAudio.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const member = await requireActiveMember(req);
    if (member instanceof Response) return member;
    const supabase = member.supabase;
    const userId = member.userId;

    const elevenApiKey = Deno.env.get('ELEVEN_API_KEY');
    if (!elevenApiKey) {
      return new Response(
        JSON.stringify({ error: "Audio generation isn't configured yet (missing ELEVEN_API_KEY)" }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { sessionId, voiceId } = await req.json();

    const session = validateThetaSessionId(sessionId);
    if (!session.ok) {
      return new Response(JSON.stringify({ error: session.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (typeof voiceId !== 'string' || !/^[A-Za-z0-9_-]{3,100}$/.test(voiceId)) {
      return new Response(JSON.stringify({ error: 'A valid voice is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { data: target, error: targetError } = await supabase
      .from('theta_targets')
      .select('id, user_id')
      .eq('session_id', session.value)
      .maybeSingle();
    if (targetError) {
      console.error('Error loading theta target ownership:', targetError);
      throw new Error('Failed to verify the audio session');
    }
    if (!target || !thetaRowBelongsToActor(target, userId)) {
      return new Response(JSON.stringify({ error: 'Audio session not found.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: savedAffirmationRows, error: savedAffirmationError } = await supabase
      .from('theta_affirmations')
      .select('target_id, category, text, order_index, user_id')
      .eq('session_id', session.value)
      .order('category')
      .order('order_index');
    if (savedAffirmationError) {
      console.error('Error loading saved theta affirmations:', savedAffirmationError);
      throw new Error('Failed to load the saved affirmations');
    }
    const affirmationResult = resolveSavedThetaAffirmations(
      savedAffirmationRows ?? [],
      target.id,
      userId,
    );
    if (!affirmationResult.ok) {
      return new Response(JSON.stringify({ error: affirmationResult.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create track record
    const { data: track, error: insertError } = await supabase
      .from('theta_tracks')
      .insert({
        session_id: session.value,
        voice_id: voiceId,
        status: 'pending',
        ...thetaActorColumns(userId),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating track record:', insertError);
      if (insertError.message?.includes('theta track generation already active')) {
        return new Response(JSON.stringify({ error: 'A track is already being generated for this session.' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw insertError;
    }

    console.log('Track created:', track.id);

    // Start background task for audio generation
    const generateAudio = async () => {
      try {
        // Update status to generating
        await supabase
          .from('theta_tracks')
          .update({ status: 'generating' })
          .eq('id', track.id);

        console.log('Starting audio generation for track:', track.id);

        // Flatten affirmations into array
        const allAffirmations: string[] = [];
        Object.values(affirmationResult.value).forEach((categoryAffirmations) => {
          if (Array.isArray(categoryAffirmations)) {
            allAffirmations.push(
              ...categoryAffirmations.filter((value) => typeof value === 'string' && value.trim().length > 0),
            );
          }
        });

        console.log(`Processing ${allAffirmations.length} affirmations`);

        // Generate narration for all affirmations in parallel (faster, avoids timeout)
        const audioSegments: Array<{ text: string; audio_base64: string }> = [];

        // Helper function to generate audio with retry logic
        const generateAudioWithRetry = async (affirmation: string, maxRetries = 3): Promise<{ text: string; audio_base64: string }> => {
          let lastError: Error | null = null;

          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              const response = await fetch(
                `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                {
                  method: 'POST',
                  headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': elevenApiKey,
                  },
                  body: JSON.stringify({
                    text: affirmation,
                    model_id: 'eleven_multilingual_v2',
                    output_format: 'mp3_44100_128',
                    voice_settings: {
                      stability: 0.6,
                      similarity_boost: 0.8,
                      style: 0.2,
                      use_speaker_boost: true
                    }
                  }),
                }
              );

              if (!response.ok) {
                throw new Error(`ElevenLabs API error: ${response.status}`);
              }

              const arrayBuffer = await response.arrayBuffer();

              // More efficient base64 encoding using Uint8Array directly
              const uint8Array = new Uint8Array(arrayBuffer);
              let binary = '';
              const chunkSize = 8192;
              for (let i = 0; i < uint8Array.length; i += chunkSize) {
                const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
                binary += String.fromCharCode.apply(null, Array.from(chunk));
              }
              const base64Audio = btoa(binary);

              return { text: affirmation, audio_base64: base64Audio };
            } catch (error) {
              lastError = error as Error;
              console.error(`Attempt ${attempt}/${maxRetries} failed for a theta audio segment`, error);

              if (attempt < maxRetries) {
                // Exponential backoff: 1s, 2s, 4s
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
              }
            }
          }

          throw lastError || new Error('Failed to generate audio after retries');
        };

        // Generate all affirmations in parallel (batch of 5 at a time to avoid rate limits)
        const batchSize = 5;
        for (let i = 0; i < allAffirmations.length; i += batchSize) {
          const batch = allAffirmations.slice(i, i + batchSize);
          const batchPromises = batch.map(affirmation => generateAudioWithRetry(affirmation));

          const batchResults = await Promise.all(batchPromises);
          audioSegments.push(...batchResults);

          console.log(`Generated ${Math.min(i + batchSize, allAffirmations.length)}/${allAffirmations.length} affirmations`);

          // Small delay between batches to respect rate limits
          if (i + batchSize < allAffirmations.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }


        console.log('All audio segments generated, returning for client-side mixing');

        // Update track record with completion (no storage upload)
        await supabase
          .from('theta_tracks')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', track.id);

        console.log('Track generation completed:', track.id);

        // Return segments for client-side mixing
        return {
          trackId: track.id,
          status: 'completed',
          segments: audioSegments,
          background_track_url: '21m.mp3'
        };

      } catch (error) {
        console.error('Background task error:', error);

        // Update track with error
        await supabase
          .from('theta_tracks')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('id', track.id);

        throw error;
      }
    };

    // Execute generation and wait for result
    const result = await generateAudio();

    // Return response with segments for client-side mixing
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-theta-track function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
