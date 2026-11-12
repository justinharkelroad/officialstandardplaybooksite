import type { VslVideo } from '@/components/vsl/VslPlayer';

/*
 * VSL videos for the funnel.
 *
 * PLACEHOLDERS (real videos expected Nov 15-20). Each video below plays a
 * local clip through `src` with made-up chapter times so the funnel can be
 * tested now. To go live with a real video:
 *   1. Set `vimeoId` to the numeric Vimeo id.
 *   2. Delete `src`, `captionsSrc` and `poster` (Vimeo supplies its own).
 *   3. Replace the chapter start times and `revealAt` with the real ones.
 * Nothing else in the code changes.
 *
 * Vimeo settings for each real video: hide Vimeo's controls and branding
 * (needs a paid plan), allow embedding on standardplaybook.com, and upload
 * captions as a text track so the CC button appears.
 */

const MILESTONES = [25, 35, 50, 75, 100];

export const VSL_VIDEOS = {
  'sp-main': {
    id: 'sp-main',
    vimeoId: 'PLACEHOLDER_SP_MAIN',
    src: '/video/team-standard-hero.mp4',
    poster: '/video/team-standard-hero-poster.jpg',
    captionsSrc: '/video/vsl-placeholder-captions.vtt',
    // 9-segment arc from the recorded Part I-IV + cap 14-18 cuts. Starts are
    // from raw segment lengths (no trims or section-card gaps yet); dial to the
    // second once Derek stitches the final cut. revealAt lands where Part IV
    // says "the pricing shows up underneath."
    chapters: [
      { title: 'Who this is for', start: 0 },
      { title: 'Who I am', start: 30 },
      { title: 'Why consistency breaks', start: 63 },
      { title: "It's a standard problem", start: 107 },
      { title: 'How Standard works', start: 168 },
      { title: 'Inside the room', start: 240 },
      { title: "Which one's for you", start: 311 },
      { title: 'The guarantee', start: 369 },
      { title: 'Make the choice', start: 400 },
    ],
    revealAt: 160,
    milestones: MILESTONES,
  },
  'sp-precall': {
    id: 'sp-precall',
    // Real pre-call video ("Are you a fit for Standard?", Vimeo 1190956500),
    // self-hosted because Vimeo embeds 401 for this account. Captions are
    // burned in, so no captionsSrc. Neither page using it (/prep, /booked)
    // acts on revealAt, so it sits at the end. (Justin, 2026-11-12)
    vimeoId: '1190956500',
    src: '/video/standard-fit-precall.mp4',
    poster: '/video/standard-fit-precall-poster.jpg',
    chapters: [{ title: 'Are you a fit for Standard?', start: 0 }],
    revealAt: 81,
    milestones: MILESTONES,
  },
  mirror: {
    id: 'mirror',
    vimeoId: 'PLACEHOLDER_MIRROR',
    src: '/video/standard90-hero.mp4',
    poster: '/video/standard90-hero-poster.jpg',
    captionsSrc: '/video/vsl-placeholder-captions.vtt',
    chapters: [
      { title: 'What the Mirror is', start: 0 },
      { title: 'The five pillars', start: 25 },
      { title: 'The 8-week challenge', start: 55 },
      { title: 'It pays for itself', start: 85 },
    ],
    revealAt: 85,
    milestones: MILESTONES,
  },
} satisfies Record<string, VslVideo>;

export type VslVideoId = keyof typeof VSL_VIDEOS;
