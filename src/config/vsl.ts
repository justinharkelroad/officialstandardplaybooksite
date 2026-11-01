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
    chapters: [
      { title: 'Who this is for', start: 0 },
      { title: "It's not a sales problem", start: 45 },
      { title: 'What a standard looks like', start: 80 },
      { title: 'What changes in 90 days', start: 115 },
      { title: 'Your two options', start: 150 },
      { title: 'What happens next', start: 180 },
    ],
    revealAt: 165,
    milestones: MILESTONES,
  },
  'sp-precall': {
    id: 'sp-precall',
    vimeoId: 'PLACEHOLDER_SP_PRECALL',
    src: '/video/boardroom-summary.mp4',
    poster: '/video/boardroom-summary-poster.jpg',
    captionsSrc: '/video/vsl-placeholder-captions.vtt',
    chapters: [
      { title: 'Before our call', start: 0 },
      { title: "What we'll cover", start: 30 },
      { title: 'What to have ready', start: 70 },
      { title: "If you're already sure", start: 105 },
    ],
    revealAt: 105,
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
