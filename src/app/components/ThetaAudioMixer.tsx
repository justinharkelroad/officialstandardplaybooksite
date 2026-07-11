import {
  useEffect,
  useMemo,
  useRef,
  useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download,
  Loader2,
  MonitorDown,
  Square,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import lameJsUrl from "lamejs/lame.min.js?url";
import {
  estimateThetaOfflineRenderBytes,
  formatThetaAudioBytes,
  getThetaAudioDeviceSignals,
  isLikelyConstrainedThetaRenderDevice,
} from "@/app/lib/thetaAudio";

declare global {
  interface LameJsEncoder {
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
    flush(): Int8Array;
  }

  interface LameJsGlobal {
    Mp3Encoder: new (channels: number, sampleRate: number, kbps: number) => LameJsEncoder;
  }

  interface Window {
    lamejs?: LameJsGlobal;
  }
}

interface AudioSegment {
  text: string;
  audio_base64: string;
}

interface ThetaAudioMixerProps {
  segments: AudioSegment[];
  backgroundTrackPath: string;
  trackId: string;
}

// Helper to load lamejs UMD build dynamically
const ensureLameLoaded = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.lamejs?.Mp3Encoder) {
      console.debug("lamejs already loaded");
      resolve(window.lamejs);
      return;
    }
    
    const script = document.createElement("script");
    script.src = lameJsUrl;
    script.onload = () => {
      if (window.lamejs?.Mp3Encoder) {
        console.debug("lamejs loaded successfully");
        resolve(window.lamejs);
      } else {
        reject(new Error("lamejs loaded but Mp3Encoder not found"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load lamejs script"));
    document.head.appendChild(script);
  });
};

export function ThetaAudioMixer({ segments, backgroundTrackPath, trackId }: ThetaAudioMixerProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'loading' | 'rendering' | 'encoding' | 'ready' | 'mobile-ready' | 'error'>('loading');
  const [mixedAudioUrl, setMixedAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mobilePlaying, setMobilePlaying] = useState(false);
  const [mobileElapsedSeconds, setMobileElapsedSeconds] = useState(0);
  const [mobileSegmentIndex, setMobileSegmentIndex] = useState(0);
  const [mobileError, setMobileError] = useState("");
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const introTimerRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const mobileStartedAtRef = useRef<number>(0);
  const mobilePlayingRef = useRef(false);
  const nextSegmentIndexRef = useRef(0);

  const durationSeconds = 21 * 60;
  const sampleRate = 44100;
  const estimatedRenderMemory = useMemo(
    () => estimateThetaOfflineRenderBytes(durationSeconds, sampleRate, 2),
    [],
  );
  const mobilePlaybackUrl = useMemo(
    () => supabase.storage.from('binaural-beats').getPublicUrl(backgroundTrackPath).data.publicUrl,
    [backgroundTrackPath],
  );

  useEffect(() => {
    if (isLikelyConstrainedThetaRenderDevice(getThetaAudioDeviceSignals())) {
      setProgress(100);
      setStatus('mobile-ready');
      return;
    }

    mixAudio();
  }, [segments, backgroundTrackPath]);

  useEffect(() => {
    return () => {
      stopMobilePlayback();
      if (mixedAudioUrl) {
        URL.revokeObjectURL(mixedAudioUrl);
      }
    };
  }, [mixedAudioUrl]);

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const mixAudio = async () => {
    try {
      stopMobilePlayback();
      setStatus('loading');
      setProgress(10);

      // Fetch background track from storage
      const { data: bgData, error: bgError } = await supabase.storage
        .from('binaural-beats')
        .download(backgroundTrackPath);

      if (bgError) throw new Error(`Failed to load background track: ${bgError.message}`);

      setProgress(20);

      // Create temporary audio context for decoding
      const tempContext = new AudioContext();
      
      // Decode background track
      const bgArrayBuffer = await bgData.arrayBuffer();
      const backgroundBuffer = await tempContext.decodeAudioData(bgArrayBuffer);

      setProgress(30);

      // Decode all affirmation segments
      const affirmationBuffers: AudioBuffer[] = [];
      for (let i = 0; i < segments.length; i++) {
        const arrayBuffer = base64ToArrayBuffer(segments[i].audio_base64);
        const audioBuffer = await tempContext.decodeAudioData(arrayBuffer);
        affirmationBuffers.push(audioBuffer);
        setProgress(30 + (i / segments.length) * 20);
      }

      setProgress(50);
      setStatus('rendering');

      // Create OfflineAudioContext for fast rendering
      const duration = durationSeconds; // 21 minutes
      const offlineContext = new OfflineAudioContext(2, sampleRate * duration, sampleRate);

      // Create master gain node for the final 30s fade out
      const masterGain = offlineContext.createGain();
      masterGain.gain.value = 1.0; // Full volume until fade
      
      // Schedule fade out in last 30 seconds (starts at 20:30, ends at 21:00)
      const fadeOutStart = duration - 30; // 1230 seconds
      masterGain.gain.setValueAtTime(1.0, fadeOutStart);
      masterGain.gain.linearRampToValueAtTime(0, duration);
      
      // Connect master gain to destination
      masterGain.connect(offlineContext.destination);

      // Setup background track at 50% volume
      const bgSource = offlineContext.createBufferSource();
      bgSource.buffer = backgroundBuffer;
      const bgGain = offlineContext.createGain();
      bgGain.gain.value = 0.5; // 50% volume for background music
      bgSource.connect(bgGain);
      bgGain.connect(masterGain); // Route through master gain for final fade
      bgSource.start(0);

      // Loop affirmations continuously until 21 minutes
      let currentTime = 20; // Start voice at 20 seconds
      console.log(`Voice track starting at ${currentTime} seconds (20s intro of binaural beats only)`);
      let loopCount = 0;

      while (currentTime < duration) {
        for (let i = 0; i < affirmationBuffers.length; i++) {
          const buffer = affirmationBuffers[i];
          
          // Stop scheduling if we've exceeded 21 minutes
          if (currentTime >= duration) break;
          
          const source = offlineContext.createBufferSource();
          source.buffer = buffer;
          
          // Connect voice directly to master gain (full volume, no individual fades)
          source.connect(masterGain);
          source.start(currentTime);
          
          currentTime += buffer.duration;
        }
        loopCount++;
      }

      console.log(`Affirmations looped ${loopCount} times, total voice duration: ${currentTime.toFixed(1)}s`);

      setProgress(60);

      // Render the audio (fast, synchronous)
      const renderedBuffer = await offlineContext.startRendering();

      setProgress(70);
      setStatus('encoding');

      // Convert to MP3 using lamejs
      const lame = await ensureLameLoaded();
      const mp3Encoder = new lame.Mp3Encoder(2, sampleRate, 128); // stereo, 44.1kHz, 128kbps
      const mp3Data: Uint8Array[] = [];

      const leftChannel = renderedBuffer.getChannelData(0);
      const rightChannel = renderedBuffer.getChannelData(1);

      setProgress(80);

      // Encode in chunks
      const chunkSize = 1152;
      const totalChunks = Math.ceil(leftChannel.length / chunkSize);
      
      for (let i = 0; i < leftChannel.length; i += chunkSize) {
        const end = Math.min(i + chunkSize, leftChannel.length);
        const leftChunk = floatChannelToInt16(leftChannel, i, end);
        const rightChunk = floatChannelToInt16(rightChannel, i, end);
        const mp3buf = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
        if (mp3buf.length > 0) mp3Data.push(new Uint8Array(mp3buf));
        
        // Update progress during encoding
        const chunkProgress = Math.floor(i / chunkSize);
        setProgress(80 + (chunkProgress / totalChunks) * 15);
      }

      // Flush remaining data
      const mp3buf = mp3Encoder.flush();
      if (mp3buf.length > 0) mp3Data.push(new Uint8Array(mp3buf));

      setProgress(95);

      // Create MP3 Blob
      const mp3Blob = new Blob(mp3Data as BlobPart[], { type: 'audio/mp3' });
      const url = URL.createObjectURL(mp3Blob);
      
      setMixedAudioUrl(url);
      setProgress(100);
      setStatus('ready');
      
      tempContext.close();
      toast.success('MP3 track ready! Works on all devices (~25 MB)');

    } catch (error: any) {
      console.error('Error mixing audio:', error);
      setErrorMessage(error.message || 'Failed to mix audio');
      setStatus('error');
      toast.error('Failed to mix audio track');
    }
  };

  const clearMobileTimers = () => {
    if (introTimerRef.current !== null) {
      window.clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }
    if (elapsedTimerRef.current !== null) {
      window.clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  };

  const stopMobilePlayback = () => {
    clearMobileTimers();
    mobilePlayingRef.current = false;

    const backgroundAudio = backgroundAudioRef.current;
    if (backgroundAudio) {
      backgroundAudio.pause();
      backgroundAudio.currentTime = 0;
    }

    const voiceAudio = voiceAudioRef.current;
    if (voiceAudio) {
      voiceAudio.pause();
      voiceAudio.removeAttribute("src");
      voiceAudio.onended = null;
      voiceAudio.load();
    }

    setMobilePlaying(false);
    setMobileElapsedSeconds(0);
    setMobileSegmentIndex(0);
  };

  const playNextMobileSegment = async () => {
    if (!mobilePlayingRef.current || segments.length === 0) return;

    const voiceAudio = voiceAudioRef.current;
    if (!voiceAudio) return;

    const segmentIndex = nextSegmentIndexRef.current % segments.length;
    const segment = segments[segmentIndex];
    setMobileSegmentIndex(segmentIndex + 1);
    nextSegmentIndexRef.current += 1;

    voiceAudio.src = `data:audio/mpeg;base64,${segment.audio_base64}`;
    voiceAudio.onended = () => {
      void playNextMobileSegment();
    };

    try {
      await voiceAudio.play();
    } catch (error) {
      console.error("Mobile theta voice playback failed:", error);
      setMobileError("Your phone blocked the voice playback. Tap Start Track again to resume.");
      stopMobilePlayback();
    }
  };

  const startMobilePlayback = async () => {
    if (!backgroundAudioRef.current || !voiceAudioRef.current) return;

    try {
      stopMobilePlayback();
      setMobileError("");
      nextSegmentIndexRef.current = 0;
      mobileStartedAtRef.current = Date.now();
      mobilePlayingRef.current = true;

      const backgroundAudio = backgroundAudioRef.current;
      backgroundAudio.src = mobilePlaybackUrl;
      backgroundAudio.currentTime = 0;
      backgroundAudio.volume = 0.5;
      backgroundAudio.loop = false;
      backgroundAudio.onended = stopMobilePlayback;

      await backgroundAudio.play();

      setMobilePlaying(true);
      elapsedTimerRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - mobileStartedAtRef.current) / 1000);
        setMobileElapsedSeconds(Math.min(elapsed, durationSeconds));
      }, 1000);
      stopTimerRef.current = window.setTimeout(stopMobilePlayback, durationSeconds * 1000);
      introTimerRef.current = window.setTimeout(() => {
        void playNextMobileSegment();
      }, 20 * 1000);

      toast.success("Theta track playback started");
    } catch (error) {
      console.error("Mobile theta playback failed:", error);
      setMobileError("Your phone blocked playback. Tap Start Track again and keep this screen open.");
      stopMobilePlayback();
    }
  };

  const handleDownload = () => {
    if (!mixedAudioUrl) return;

    const a = document.createElement('a');
    a.href = mixedAudioUrl;
    a.download = `theta-track-${trackId}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Download started!");
  };

  const formatElapsed = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (status === 'error') {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error: {errorMessage}</p>
          <Button onClick={mixAudio} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (status === 'ready' && mixedAudioUrl) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Download className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Your Theta Track is Ready!</h3>
            <p className="text-muted-foreground text-sm mt-2">
              21-minute personalized theta binaural beats with your affirmations (~25 MB MP3)
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              ✅ Works on all devices (iOS, Android, Windows, Mac)
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleDownload} size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Track
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" size="lg">
              Create Another
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (status === 'mobile-ready') {
    return (
      <Card className="p-6">
        <audio ref={backgroundAudioRef} preload="none" />
        <audio ref={voiceAudioRef} preload="none" />
        <div className="text-center space-y-5">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Volume2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Your Theta Track Is Ready</h3>
            <p className="text-muted-foreground text-sm mt-2">
              This phone can play the track here without the high-memory MP3 render that was restarting the app.
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Full MP3 download rendering needs about {formatThetaAudioBytes(estimatedRenderMemory)} of working audio memory, so use a desktop browser for the downloadable file.
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={(mobileElapsedSeconds / durationSeconds) * 100} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {mobilePlaying
                ? `${formatElapsed(mobileElapsedSeconds)} / 21:00 • Affirmation ${mobileSegmentIndex || 1} of ${segments.length}`
                : "21-minute streaming playback"}
            </p>
          </div>

          {mobileError && (
            <p className="text-sm text-destructive">{mobileError}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {mobilePlaying ? (
              <Button onClick={stopMobilePlayback} variant="outline" size="lg">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button onClick={startMobilePlayback} size="lg">
                <Volume2 className="w-4 h-4 mr-2" />
                Start Track
              </Button>
            )}
            <Button disabled variant="outline" size="lg">
              <MonitorDown className="w-4 h-4 mr-2" />
              MP3 Download on Desktop
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <div>
          <h3 className="text-lg font-semibold">
            {status === 'loading' && 'Loading Audio...'}
            {status === 'rendering' && 'Rendering Track...'}
            {status === 'encoding' && 'Encoding MP3...'}
          </h3>
          <p className="text-muted-foreground text-sm mt-2">
            {status === 'loading' && 'Preparing audio files...'}
            {status === 'rendering' && 'Fast synchronous rendering in progress...'}
            {status === 'encoding' && 'Converting to MP3 format (~30 seconds)...'}
          </p>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">{progress}%</p>
        </div>
      </div>
    </Card>
  );
}

const floatChannelToInt16 = (channel: Float32Array, start: number, end: number): Int16Array => {
  const pcm = new Int16Array(end - start);

  for (let i = start; i < end; i++) {
    const sample = Math.max(-1, Math.min(1, channel[i]));
    pcm[i - start] = sample < 0 ? sample * 32768 : sample * 32767;
  }

  return pcm;
};
