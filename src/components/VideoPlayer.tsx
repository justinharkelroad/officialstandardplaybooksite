
import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  className?: string;
}

const VideoPlayer = ({ videoId, title = "Demo Video", className = "" }: VideoPlayerProps) => {
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
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1&controls=1`}
      title={title}
      className={className}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default VideoPlayer;
