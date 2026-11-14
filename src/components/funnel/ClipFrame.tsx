import type { Clip } from '@/config/startPage';

/** One clip: a muted autoplay loop with controls to unmute (demo), a player with controls, or a placeholder frame. */
const ClipFrame = ({ clip, loop = false }: { clip: Clip; loop?: boolean }) => (
  <figure className="fn-clip">
    <div className="fn-clip__frame">
      {clip.src ? (
        loop ? (
          <video src={clip.src} poster={clip.poster} muted loop autoPlay playsInline controls preload="metadata" aria-label={clip.title} />
        ) : (
          <video src={clip.src} poster={clip.poster} controls playsInline preload="none" aria-label={clip.title} />
        )
      ) : (
        <div className="fn-clip__placeholder">Clip coming soon</div>
      )}
    </div>
    <figcaption>{clip.title}</figcaption>
  </figure>
);

export default ClipFrame;
