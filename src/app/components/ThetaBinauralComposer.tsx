import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Sparkles } from "lucide-react";
import { useGenerateThetaTrack } from "@/app/hooks/useThetaTrack";
import { ThetaAudioMixer } from "./ThetaAudioMixer";
import { toast } from "sonner";
import { AppIcon } from "@/app/components/icons/appIcons";

interface ThetaBinauralComposerProps {
  sessionId: string;
  voiceId: string;
  affirmations: Record<'body' | 'being' | 'balance' | 'business', string[]>;
}

interface GeneratedResult {
  trackId: string;
  status: string;
  segments: Array<{ text: string; audio_base64: string }>;
  background_track_url: string;
}

export function ThetaBinauralComposer({
  sessionId,
  voiceId,
  affirmations
}: ThetaBinauralComposerProps) {
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const generateMutation = useGenerateThetaTrack();

  const handleGenerate = async () => {
    try {
      const result = await generateMutation.mutateAsync({
        sessionId,
        voiceId,
      });
      
      setGeneratedResult(result);
      toast.success('Affirmations generated! Now mixing your track...');
    } catch (error) {
      // The mutation's onError already surfaces the real error message in a toast.
      console.error('Generation failed:', error);
    }
  };

  // If we have generated results, show the mixer
  if (generatedResult) {
    return (
      <ThetaAudioMixer
        segments={generatedResult.segments}
        backgroundTrackPath={generatedResult.background_track_url}
        trackId={generatedResult.trackId}
      />
    );
  }

  // Initial state - ready to generate
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Theta Binaural Composer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">
                <Sparkles className="h-3 w-3 mr-1" />
                21 Minutes
              </Badge>
              <div className="text-sm space-y-1">
                <p className="font-medium">Professional Theta Track</p>
                <p className="text-muted-foreground">
                  Your personalized affirmations will be woven into a 21-minute theta binaural beats background (4-8 Hz)
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-medium text-sm mb-2">What You'll Get:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>20 affirmations narrated in your chosen AI voice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Theta binaural beats (4-8 Hz) for deep meditation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Perfectly timed spacing throughout 21 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>High-quality audio ready for immediate download</span>
              </li>
            </ul>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
            <p className="mb-1 flex items-center gap-2 font-medium"><AppIcon name="headphones" className="h-4 w-4" /> Best Practices:</p>
            <ul className="space-y-1 ml-4">
              <li>• Listen with headphones for full binaural effect</li>
              <li>• Use during meditation, sleep, or focused work</li>
              <li>• Play daily for 21 days for maximum impact</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="w-full h-12 text-base"
          size="lg"
        >
          {generateMutation.isPending ? (
            <>
              <span className="animate-pulse">Generating Affirmations...</span>
            </>
          ) : (
            <>
              <Music className="mr-2 h-5 w-5" />
              Generate My Theta Track
            </>
          )}
        </Button>

        {generateMutation.isPending && (
          <p className="text-xs text-center text-muted-foreground">
            This takes about 1-2 minutes. We're creating {Object.values(affirmations).flat().length} personalized affirmations...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
