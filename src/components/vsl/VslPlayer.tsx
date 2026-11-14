/**
 * VslPlayer: a sales-video player with named chapters, a muted-autoplay
 * "tap to unmute" start, resume, a reveal callback and milestone events.
 *
 * Standalone on purpose. It imports only React and @vimeo/player so it can be
 * copied into the Agency Brain repo as is. Everything site-specific (where
 * events are sent, what the reveal shows) comes in through props.
 *
 * Source selection, in order:
 *   1. `src` (a direct mp4 URL) plays in a native <video>.
 *   2. A numeric `vimeoId` plays through the Vimeo Player SDK with Vimeo's
 *      own controls hidden (hiding them needs a paid Vimeo plan).
 *   3. Anything else renders a "video coming soon" frame.
 * Placeholder configs set `src` to a local clip so the whole funnel can be
 * tested before the real videos exist. Removing `src` switches to Vimeo.
 *
 * @vimeo/player ships no types. Repos with noImplicitAny need
 * @types/vimeo__player or a module declaration.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import VimeoPlayerSdk from '@vimeo/player';

export interface VslChapter {
  title: string;
  /** Seconds from the start of the video. */
  start: number;
}

export interface VslVideo {
  id: string;
  vimeoId: string;
  /** Direct mp4. When set it is played instead of Vimeo. */
  src?: string;
  /** WebVTT captions for `src`. Vimeo videos use their own text tracks. */
  captionsSrc?: string;
  poster?: string;
  chapters: VslChapter[];
  /** Seconds. Once playback passes this point, `onReveal` fires. */
  revealAt: number;
  /** Percentages of the video, e.g. [25, 35, 50, 75, 100]. */
  milestones: number[];
}

export type VslEventName = 'vsl_play' | 'vsl_unmute' | 'vsl_chapter' | 'vsl_milestone' | 'vsl_reveal';

export interface VslEvent {
  name: VslEventName;
  videoId: string;
  value?: string | number;
  /** Playback position in seconds when the event fired. */
  position: number;
}

export interface VslPlayerProps {
  video: VslVideo;
  onEvent?: (event: VslEvent) => void;
  onReveal?: () => void;
  className?: string;
  /** Colour for the chapter bar and buttons. */
  accent?: string;
}

/* ── Playback engines ───────────────────────────────────── */

interface Engine {
  play(): void;
  pause(): void;
  seek(seconds: number): void;
  setMuted(muted: boolean): void;
  setCaptions(on: boolean): void;
  /** Used when the container itself can't go full screen (iPhone). */
  nativeFullscreen(): void;
  destroy(): void;
}

interface EngineCallbacks {
  onReady(duration: number, hasCaptions: boolean): void;
  onTime(seconds: number, duration: number): void;
  onPlaying(playing: boolean): void;
  onEnded(): void;
  onError(message: string): void;
}

const ignore = () => undefined;

function createHtml5Engine(host: HTMLDivElement, video: VslVideo, cb: EngineCallbacks): Engine {
  const el = document.createElement('video');
  el.muted = true;
  el.autoplay = true;
  el.playsInline = true;
  el.preload = 'auto';
  el.setAttribute('playsinline', '');
  el.setAttribute('webkit-playsinline', '');
  if (video.poster) el.poster = video.poster;
  if (video.captionsSrc) {
    const track = document.createElement('track');
    track.kind = 'captions';
    track.srclang = 'en';
    track.label = 'English';
    track.src = video.captionsSrc;
    el.appendChild(track);
  }
  el.src = video.src ?? '';
  host.appendChild(el);

  const onMeta = () => {
    const track = el.textTracks[0];
    if (track) track.mode = 'hidden';
    cb.onReady(el.duration, Boolean(video.captionsSrc));
  };
  const onTime = () => cb.onTime(el.currentTime, el.duration || 0);
  const onPlay = () => cb.onPlaying(true);
  const onPause = () => cb.onPlaying(false);
  const onEnded = () => { cb.onPlaying(false); cb.onEnded(); };
  const onError = () => cb.onError('The video failed to load.');
  el.addEventListener('loadedmetadata', onMeta);
  el.addEventListener('timeupdate', onTime);
  el.addEventListener('playing', onPlay);
  el.addEventListener('pause', onPause);
  el.addEventListener('ended', onEnded);
  el.addEventListener('error', onError);
  el.play().catch(() => cb.onPlaying(false));

  return {
    // Every call stays synchronous so iPhone Safari still sees the tap.
    play: () => { el.play().catch(() => cb.onPlaying(false)); },
    pause: () => el.pause(),
    seek: (s) => { el.currentTime = s; },
    setMuted: (m) => { el.muted = m; if (!m) el.volume = 1; },
    setCaptions: (on) => {
      const track = el.textTracks[0];
      if (track) track.mode = on ? 'showing' : 'hidden';
    },
    nativeFullscreen: () => {
      const webkitEl = el as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
      if (webkitEl.webkitEnterFullscreen) webkitEl.webkitEnterFullscreen();
      else el.requestFullscreen?.().catch(ignore);
    },
    destroy: () => {
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('playing', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('error', onError);
      el.pause();
      el.removeAttribute('src');
      el.load();
      el.remove();
    },
  };
}

/** The slice of the Vimeo Player SDK this component uses. */
interface VimeoTextTrack { language: string; kind: string }
interface VimeoLike {
  ready(): Promise<void>;
  on(event: string, handler: (data: { seconds: number; duration: number }) => void): void;
  play(): Promise<void>;
  pause(): Promise<void>;
  setCurrentTime(seconds: number): Promise<number>;
  setMuted(muted: boolean): Promise<boolean>;
  setVolume(volume: number): Promise<number>;
  getDuration(): Promise<number>;
  getTextTracks(): Promise<VimeoTextTrack[]>;
  enableTextTrack(language: string, kind?: string): Promise<VimeoTextTrack>;
  disableTextTrack(): Promise<void>;
  requestFullscreen(): Promise<void>;
  destroy(): Promise<void>;
}
type VimeoCtor = new (el: HTMLElement, options: Record<string, unknown>) => VimeoLike;

function createVimeoEngine(host: HTMLDivElement, video: VslVideo, cb: EngineCallbacks): Engine {
  const Ctor = VimeoPlayerSdk as unknown as VimeoCtor;
  const player = new Ctor(host, {
    id: Number(video.vimeoId),
    autoplay: true,
    muted: true,
    controls: false,
    playsinline: true,
    dnt: true,
    title: false,
    byline: false,
    portrait: false,
    keyboard: false,
    pip: false,
  });
  let captionTrack: VimeoTextTrack | null = null;

  player.ready()
    .then(async () => {
      const [duration, tracks] = await Promise.all([
        player.getDuration(),
        player.getTextTracks().catch(() => [] as VimeoTextTrack[]),
      ]);
      captionTrack = tracks.find((t) => t.kind === 'captions' || t.kind === 'subtitles') ?? null;
      cb.onReady(duration, Boolean(captionTrack));
    })
    .catch((err: unknown) => cb.onError(err instanceof Error ? err.message : 'The video failed to load.'));
  player.on('timeupdate', (d) => cb.onTime(d.seconds, d.duration));
  player.on('play', () => cb.onPlaying(true));
  player.on('pause', () => cb.onPlaying(false));
  player.on('ended', () => { cb.onPlaying(false); cb.onEnded(); });

  return {
    play: () => { player.play().catch(() => cb.onPlaying(false)); },
    pause: () => { player.pause().catch(ignore); },
    seek: (s) => { player.setCurrentTime(s).catch(ignore); },
    setMuted: (m) => {
      player.setMuted(m).catch(ignore);
      if (!m) player.setVolume(1).catch(ignore);
    },
    setCaptions: (on) => {
      if (!captionTrack) return;
      if (on) player.enableTextTrack(captionTrack.language, captionTrack.kind).catch(ignore);
      else player.disableTextTrack().catch(ignore);
    },
    nativeFullscreen: () => { player.requestFullscreen().catch(ignore); },
    destroy: () => { player.destroy().catch(ignore); },
  };
}

/* ── Local storage (every access can throw) ─────────────── */

const storageKey = (id: string, field: string) => `vsl:${id}:${field}`;

function readStored(id: string, field: string): string | null {
  try { return window.localStorage.getItem(storageKey(id, field)); } catch { return null; }
}

function writeStored(id: string, field: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(storageKey(id, field));
    else window.localStorage.setItem(storageKey(id, field), value);
  } catch {
    // Private mode or blocked storage: resume and dedupe just stop working.
  }
}

function readMilestones(id: string): Set<number> {
  try { return new Set(JSON.parse(readStored(id, 'milestones') ?? '[]') as number[]); } catch { return new Set(); }
}

/* ── Helpers ────────────────────────────────────────────── */

/** Don't offer to resume a few seconds in, or right before the end. */
const RESUME_MIN_SECONDS = 10;
const RESUME_END_MARGIN = 10;
const SAVE_EVERY_SECONDS = 3;

const formatTime = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const chapterIndexAt = (chapters: VslChapter[], seconds: number) => {
  let index = 0;
  chapters.forEach((c, i) => { if (seconds >= c.start) index = i; });
  return index;
};

type Overlay = 'unmute' | 'resume' | 'tap' | null;

/* ── Component ──────────────────────────────────────────── */

const VslPlayer = ({ video, onEvent, onReveal, className, accent = '#2997FF' }: VslPlayerProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const chapters = useMemo(
    () => [...video.chapters].sort((a, b) => a.start - b.start),
    [video.chapters],
  );
  const source: 'html5' | 'vimeo' | 'none' = video.src ? 'html5' : /^\d+$/.test(video.vimeoId) ? 'vimeo' : 'none';

  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [hasCaptions, setHasCaptions] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeAt] = useState(() => {
    const saved = Number(readStored(video.id, 'position'));
    return Number.isFinite(saved) && saved >= RESUME_MIN_SECONDS ? saved : 0;
  });
  const [overlay, setOverlay] = useState<Overlay>(resumeAt > 0 ? 'resume' : 'unmute');

  // Callbacks and fired-event bookkeeping live in refs so the engine's
  // listeners, created once per video, always see current values.
  const onEventRef = useRef(onEvent);
  const onRevealRef = useRef(onReveal);
  onEventRef.current = onEvent;
  onRevealRef.current = onReveal;
  const live = useRef({
    engaged: false,
    played: false,
    playing: false,
    revealed: readStored(video.id, 'revealed') === '1',
    chapter: -1,
    milestones: readMilestones(video.id),
    lastSaved: 0,
    position: 0,
  });

  const emit = useCallback((name: VslEventName, value?: string | number) => {
    onEventRef.current?.({ name, videoId: video.id, value, position: Math.round(live.current.position) });
  }, [video.id]);

  // Already past the reveal point on an earlier visit: show the menu now.
  useEffect(() => {
    if (live.current.revealed) onRevealRef.current?.();
  }, []);

  const reveal = useCallback(() => {
    if (live.current.revealed) return;
    live.current.revealed = true;
    writeStored(video.id, 'revealed', '1');
    emit('vsl_reveal', video.revealAt);
    onRevealRef.current?.();
  }, [emit, video.id, video.revealAt]);

  const markMilestone = useCallback((m: number) => {
    const fired = live.current.milestones;
    if (fired.has(m)) return;
    fired.add(m);
    writeStored(video.id, 'milestones', JSON.stringify([...fired]));
    emit('vsl_milestone', m);
  }, [emit, video.id]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || source === 'none') return;
    const callbacks: EngineCallbacks = {
      onReady: (d, captions) => { setDuration(d); setHasCaptions(captions); },
      onTime: (t, d) => {
        const state = live.current;
        state.position = t;
        setTime(t);
        if (d) setDuration(d);
        if (t >= video.revealAt) reveal();
        if (!state.engaged) return;
        const index = chapterIndexAt(chapters, t);
        if (chapters.length && index !== state.chapter) {
          state.chapter = index;
          emit('vsl_chapter', chapters[index].title);
        }
        if (d) {
          const pct = (t / d) * 100;
          video.milestones.forEach((m) => { if (m < 100 && pct >= m) markMilestone(m); });
        }
        if (Math.abs(t - state.lastSaved) >= SAVE_EVERY_SECONDS) {
          state.lastSaved = t;
          const nearEnd = d && t > d - RESUME_END_MARGIN;
          writeStored(video.id, 'position', nearEnd ? null : String(Math.floor(t)));
        }
      },
      onPlaying: (isPlaying) => {
        live.current.playing = isPlaying;
        setPlaying(isPlaying);
        if (isPlaying && !live.current.played) {
          live.current.played = true;
          emit('vsl_play', live.current.engaged ? 'sound' : 'muted');
        }
      },
      onEnded: () => {
        if (live.current.engaged && video.milestones.includes(100)) markMilestone(100);
        writeStored(video.id, 'position', null);
      },
      onError: (message) => setError(message),
    };
    const engine = source === 'html5'
      ? createHtml5Engine(host, video, callbacks)
      : createVimeoEngine(host, video, callbacks);
    engineRef.current = engine;
    return () => {
      engineRef.current = null;
      engine.destroy();
    };
    // The engine is rebuilt only when the source itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.id, video.src, video.vimeoId, source]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  /** Start (or restart) with sound. Called straight from a tap. */
  const startWithSound = useCallback((from: number, how: string) => {
    const engine = engineRef.current;
    if (!engine) return;
    live.current.engaged = true;
    live.current.chapter = -1;
    setEngaged(true);
    setOverlay(null);
    engine.setMuted(false);
    engine.seek(from);
    engine.play();
    emit('vsl_unmute', how);
    // iPhone Safari pauses a cross-origin player it won't let unmute.
    // Offer one more tap instead of leaving a frozen frame.
    window.setTimeout(() => {
      if (engineRef.current === engine && !document.hidden && !live.current.playing) setOverlay('tap');
    }, 1200);
  }, [emit]);

  const togglePlay = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (playing) engine.pause();
    else engine.play();
  };

  const seekTo = (seconds: number) => {
    const engine = engineRef.current;
    if (!engine || !duration) return;
    const clamped = Math.max(0, Math.min(seconds, duration - 0.25));
    live.current.position = clamped;
    setTime(clamped);
    engine.seek(clamped);
  };

  const jumpToChapter = (chapter: VslChapter) => {
    if (!live.current.engaged) {
      startWithSound(chapter.start, 'chapter');
      return;
    }
    seekTo(chapter.start);
    engineRef.current?.play();
  };

  const fractionFromPointer = (clientX: number) => {
    const bar = barRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const onBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!duration) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekTo(fractionFromPointer(e.clientX) * duration);
  };

  const onBarPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!duration || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    seekTo(fractionFromPointer(e.clientX) * duration);
  };

  const onBarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); seekTo(time + 5); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); seekTo(time - 5); }
  };

  const toggleCaptions = () => {
    const next = !captionsOn;
    setCaptionsOn(next);
    engineRef.current?.setCaptions(next);
  };

  const toggleFullscreen = () => {
    const frame = frameRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    if (!frame) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(ignore);
    } else if (frame.requestFullscreen) {
      frame.requestFullscreen().catch(() => engineRef.current?.nativeFullscreen());
    } else if (frame.webkitRequestFullscreen) {
      frame.webkitRequestFullscreen();
    } else {
      engineRef.current?.nativeFullscreen();
    }
  };

  // Persist the position when the visitor leaves mid-video.
  useEffect(() => {
    const save = () => {
      const { engaged: isEngaged, position } = live.current;
      if (isEngaged && position >= RESUME_MIN_SECONDS) writeStored(video.id, 'position', String(Math.floor(position)));
    };
    window.addEventListener('pagehide', save);
    return () => { save(); window.removeEventListener('pagehide', save); };
  }, [video.id]);

  const currentIndex = chapterIndexAt(chapters, time);
  const current = chapters[currentIndex];
  const total = duration || (chapters.length ? chapters[chapters.length - 1].start + 1 : 1);
  const segments = chapters.length ? chapters : [{ title: '', start: 0 }];

  return (
    <div className={`vslp${className ? ` ${className}` : ''}`} style={{ '--vslp-accent': accent } as React.CSSProperties}>
      <style>{PLAYER_CSS}</style>
      <div ref={frameRef} className={`vslp-frame${isFullscreen ? ' is-fullscreen' : ''}`}>
        <div ref={hostRef} className="vslp-host" />

        {source === 'none' && (
          <div className="vslp-empty">
            <span>Video coming soon</span>
          </div>
        )}
        {error && (
          <div className="vslp-empty">
            <span>{error}</span>
          </div>
        )}

        {source !== 'none' && !error && overlay && (
          <div className="vslp-overlay">
            {overlay === 'unmute' && (
              <button type="button" className="vslp-cta" onClick={() => startWithSound(0, 'restart')}>
                <SoundIcon />
                <span>Tap to unmute and restart</span>
              </button>
            )}
            {overlay === 'resume' && (
              <div className="vslp-resume">
                <p>Pick up where you left off?</p>
                <button type="button" className="vslp-cta" onClick={() => startWithSound(resumeAt, 'resume')}>
                  <PlayIcon />
                  <span>Resume at {formatTime(resumeAt)}</span>
                </button>
                <button type="button" className="vslp-link" onClick={() => startWithSound(0, 'restart')}>
                  Start from the beginning
                </button>
              </div>
            )}
            {overlay === 'tap' && (
              <button
                type="button"
                className="vslp-cta"
                onClick={() => {
                  setOverlay(null);
                  engineRef.current?.setMuted(false);
                  engineRef.current?.play();
                }}
              >
                <PlayIcon />
                <span>Tap to play with sound</span>
              </button>
            )}
          </div>
        )}

        {engaged && !overlay && (
          <>
            <button type="button" className="vslp-surface" aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay} />
            <div className="vslp-controls">
              <div
                ref={barRef}
                className="vslp-bar"
                role="slider"
                tabIndex={0}
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(total)}
                aria-valuenow={Math.round(time)}
                aria-valuetext={`${formatTime(time)} of ${formatTime(total)}`}
                onPointerDown={onBarPointerDown}
                onPointerMove={onBarPointerMove}
                onKeyDown={onBarKeyDown}
              >
                {segments.map((c, i) => {
                  const end = i < segments.length - 1 ? segments[i + 1].start : total;
                  const length = Math.max(end - c.start, 0.001);
                  const fill = Math.max(0, Math.min(1, (time - c.start) / length));
                  return (
                    <div key={`${c.start}-${c.title}`} className="vslp-seg" style={{ flexGrow: length }} title={c.title}>
                      <div className="vslp-seg-fill" style={{ transform: `scaleX(${fill})` }} />
                    </div>
                  );
                })}
              </div>
              <div className="vslp-row">
                <button type="button" className="vslp-btn" aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <span className="vslp-time">{formatTime(time)} / {formatTime(total)}</span>
                {current?.title && <span className="vslp-chapter" aria-live="polite">{current.title}</span>}
                <span className="vslp-spacer" />
                {hasCaptions && (
                  <button
                    type="button"
                    className={`vslp-btn vslp-cc${captionsOn ? ' is-on' : ''}`}
                    aria-label={captionsOn ? 'Turn captions off' : 'Turn captions on'}
                    aria-pressed={captionsOn}
                    onClick={toggleCaptions}
                  >
                    CC
                  </button>
                )}
                <button type="button" className="vslp-btn" aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'} onClick={toggleFullscreen}>
                  <FullscreenIcon />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {chapters.length > 1 && (
        <ol className="vslp-chapters" aria-label="Chapters">
          {chapters.map((c, i) => (
            <li key={`${c.start}-${c.title}`}>
              <button
                type="button"
                className={i === currentIndex && engaged ? 'is-current' : undefined}
                onClick={() => jumpToChapter(c)}
              >
                <span className="vslp-chapter-time">{formatTime(c.start)}</span>
                <span>{c.title}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

/* ── Icons ──────────────────────────────────────────────── */

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor" /></svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" /></svg>
);
const SoundIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
    <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
    <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);
const FullscreenIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="square" />
  </svg>
);

/* ── Styles (inline so the file stays self-contained) ───── */

const PLAYER_CSS = `
.vslp { --vslp-ink: #0a0a0b; --vslp-paper: #f4f2ee; width: 100%; font-family: Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif; }
.vslp *, .vslp *::before, .vslp *::after { box-sizing: border-box; }
.vslp-frame { position: relative; width: 100%; aspect-ratio: 16 / 9; background: #000; overflow: hidden; }
.vslp-frame.is-fullscreen { aspect-ratio: auto; height: 100%; }
.vslp-host, .vslp-host video, .vslp-host iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.vslp-host video { object-fit: contain; background: #000; }
.vslp-host > div { position: absolute; inset: 0; }
.vslp-empty { position: absolute; inset: 0; display: grid; place-items: center; color: var(--vslp-paper); font-size: 13px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; background: repeating-linear-gradient(135deg, #111 0 14px, #161616 14px 28px); }
.vslp-overlay { position: absolute; inset: 0; display: grid; place-items: center; padding: 16px; background: rgba(10,10,11,.38); }
.vslp-cta { display: inline-flex; align-items: center; gap: 12px; padding: 18px 26px; border: 0; border-radius: 0; background: var(--vslp-accent); color: #fff; font: inherit; font-size: clamp(14px, 2.4vw, 18px); font-weight: 800; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; box-shadow: 0 18px 50px -12px rgba(0,0,0,.6); -webkit-tap-highlight-color: transparent; }
.vslp-cta:focus-visible, .vslp-btn:focus-visible, .vslp-link:focus-visible, .vslp-bar:focus-visible, .vslp-chapters button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.vslp-resume { display: grid; justify-items: center; gap: 14px; text-align: center; color: #fff; }
.vslp-resume p { margin: 0; font-size: clamp(16px, 2.6vw, 22px); font-weight: 700; }
.vslp-link { border: 0; background: none; color: #fff; font: inherit; font-size: 14px; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; padding: 6px; }
.vslp-surface { position: absolute; inset: 0 0 64px 0; border: 0; background: transparent; cursor: pointer; }
.vslp-controls { position: absolute; left: 0; right: 0; bottom: 0; padding: 18px 12px 8px; background: linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,0)); color: #fff; }
.vslp-bar { display: flex; gap: 3px; height: 22px; align-items: center; cursor: pointer; touch-action: none; }
.vslp-seg { position: relative; height: 5px; flex-basis: 0; background: rgba(255,255,255,.32); overflow: hidden; transition: height .15s; }
.vslp-bar:hover .vslp-seg { height: 8px; }
.vslp-seg-fill { position: absolute; inset: 0; background: var(--vslp-accent); transform-origin: left center; }
.vslp-row { display: flex; align-items: center; gap: 8px; min-height: 40px; }
.vslp-btn { display: inline-grid; place-items: center; min-width: 40px; height: 40px; padding: 0 8px; border: 0; background: transparent; color: #fff; font: inherit; font-size: 12px; font-weight: 800; letter-spacing: .06em; cursor: pointer; }
.vslp-cc { border: 1.5px solid rgba(255,255,255,.6); height: 26px; min-width: 34px; }
.vslp-cc.is-on { background: #fff; color: var(--vslp-ink); border-color: #fff; }
.vslp-time { font-size: 12px; font-variant-numeric: tabular-nums; opacity: .85; white-space: nowrap; }
.vslp-chapter { font-size: 12px; font-weight: 700; letter-spacing: .04em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.vslp-spacer { flex: 1; }
.vslp-chapters { list-style: none; margin: 0; padding: 10px 0 0; display: flex; gap: 8px; overflow-x: auto; scrollbar-width: thin; }
.vslp-chapters li { flex: 0 0 auto; }
.vslp-chapters button { display: inline-flex; align-items: baseline; gap: 8px; padding: 9px 12px; border: 1.5px solid currentColor; background: transparent; color: inherit; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; opacity: .72; white-space: nowrap; }
.vslp-chapters button.is-current { opacity: 1; border-color: var(--vslp-accent); color: var(--vslp-accent); }
.vslp-chapter-time { font-size: 11px; font-variant-numeric: tabular-nums; opacity: .7; }
/* Wider screens: wrap so every chapter is visible, centered so the second row reads as a layout, not overflow. A mouse wheel can't scroll sideways on Windows. Phones keep the swipe row. */
@media (min-width: 700px) { .vslp-chapters { flex-wrap: wrap; justify-content: center; overflow-x: visible; } }
@media (max-width: 520px) {
  .vslp-time { display: none; }
  .vslp-cta { padding: 12px 16px; gap: 8px; font-size: 13px; }
  .vslp-controls { padding: 14px 6px 4px; }
}
`;

export default VslPlayer;
