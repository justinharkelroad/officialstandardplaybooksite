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
    // Final cut (2026-11-13): the nine "- 4K.mov" chapter clips joined in
    // order, each trimmed where it cuts to its black STANDARD end card (the
    // last clip keeps it), 1080p, -16 LUFS, 8:02. Hosted on Cloudflare R2
    // because it is over the 25 MiB Pages file limit; its host must stay in
    // media-src in public/_headers. Captions are burned in, so no captionsSrc.
    // R2 bucket `standard-media`. New cut = new dated filename (served immutable).
    src: 'https://media.standardplaybook.com/vsl/standard-vsl-2026-11-13.mp4',
    poster: '/video/standard-vsl-poster.jpg',
    // Starts are the measured seams of the joined file (seconds). revealAt is
    // "The pricing for everything we have is going to show up underneath."
    chapters: [
      { title: 'Who this is for', start: 0 },
      { title: 'Who I am', start: 29.2 },
      { title: 'Why consistency breaks', start: 90.2 },
      { title: "It's a standard problem", start: 123.7 },
      { title: 'How Standard works', start: 167.2 },
      { title: 'Inside the room', start: 240.5 },
      { title: "Which one's for you", start: 312.9 },
      { title: 'The guarantee', start: 372.1 },
      { title: 'Make the choice', start: 404.6 },
    ],
    revealAt: 157,
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
