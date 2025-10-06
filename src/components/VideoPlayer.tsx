
import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
}

const VideoPlayer = ({ videoId, title = "Demo Video", className = "", autoplay = false }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && iframeRef.current) {
        // Pause video when tab is not visible
        iframeRef.current.contentWindow?.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*'
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&autoplay=${autoplay ? 1 : 0}&mute=${autoplay ? 1 : 0}&playsinline=1&rel=0&modestbranding=1`}
      title={title}
      className={className}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default VideoPlayer;
