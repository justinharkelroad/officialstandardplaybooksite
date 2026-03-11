export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  keywords: string[];
  ogImage?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-insurance-agency-owners-need-coaching',
    title: 'Why Insurance Agency Owners Need Coaching to Scale Past $1M',
    description: 'Most insurance agency owners hit a ceiling. Coaching gives you the systems, accountability, and perspective to break through it.',
    content: `
You built your agency from scratch. You know the grind — the early mornings, the cold calls, the constant pivoting. But somewhere between $500K and $1M in revenue, something shifts.

The skills that got you here won't get you there.

## The Ceiling Is Real

Most agency owners hit a growth ceiling not because they lack ambition, but because they're still operating as the best producer in their own shop. You're closing deals, managing staff, handling service issues, and somehow trying to think strategically — all at the same time.

That's not leadership. That's survival.

## What Coaching Actually Does

Coaching isn't about motivation. It's about systems. The right coach helps you:

- **Build repeatable sales processes** that don't depend on you
- **Develop producers** who can carry the revenue load
- **Install accountability systems** that keep your team performing when you're not watching
- **Think like an owner**, not an operator

## Why Operators Coach Better Than Consultants

There's a difference between someone who's read about running an agency and someone who's done it. At The Standard Playbook, our coaching comes from 20+ years of operating Allstate agencies — not from a textbook.

We've made the mistakes. We've found what works. And we've built programs specifically for agency owners who are ready to stop managing chaos and start running a system.

## Ready to Break Through?

If you're an insurance agency owner doing $500K+ and feeling stuck, it might be time to get in the room with people who've already built what you're trying to build.

[Explore our programs](/decision) or [book a call](/contact) to find the right fit.
    `.trim(),
    date: '2026-03-11',
    keywords: ['insurance agency coaching', 'agency growth', 'insurance agency scaling', 'business coaching for agents'],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
