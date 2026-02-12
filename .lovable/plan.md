

## Flip Cards for Offer Ladder Benefits

Add a flip-card interaction to each of the three offer cards (Boardroom, 8 Week Experience, The Directive) so users can reveal a second card behind each one showing the membership benefits.

### How It Works

- Each card gets a "See What's Included" button/link
- Clicking it flips the card 180 degrees (3D Y-axis rotation) to reveal a back face listing the benefits
- The back face has a "Flip Back" button to return to the front
- Smooth CSS 3D transform animation (~0.6s)

### Benefits Data Per Card

**The Boardroom ($299/mo)**
- 2 Hour Group Boardroom Call
- Boardroom Level Access To Standard App
- AgencyBrain Access
- The Standard Playbook Hardcover
- I AM THE STANDARD T-Shirt
- I AM THE STANDARD Wristband
- Standard Playbook Pen
- 1v1 Video Coaching 24/7 w/ Justin
- 20 AI Calls Scored Per Month

**8 Week Experience**
- 8-Week Sales Management System
- Weekly Live Coaching Calls
- Full Standard App Access
- Call Scoring Integration
- Accountability Framework
- Consequence Ladder System
- Sales Process Playbook

**The Directive**
- Everything in Boardroom
- 100 Calls Scored/Month
- 1 Team Call Per Month
- Full App Access
- 80% Off Producer Challenges
- Direct 1:1 Access to Justin

### Technical Details

1. **State**: Add a `flippedStates` boolean array (one per offer) in `OfferLadderSection`
2. **CSS**: Use `transform-style: preserve-3d` on the card wrapper, with `rotateY(180deg)` on flip. Front and back faces use `backface-visibility: hidden`, back face pre-rotated 180deg
3. **Back Face Design**: Dark card matching the existing aesthetic (dark bg, blue-400 accents, check marks for each benefit, the CTA button repeated at the bottom)
4. **Trigger**: A small "See What's Included" text link below the description on the front face
5. **Video cards**: The video keeps playing behind the front face; the back face is a solid dark panel so video doesn't show through
6. **File changed**: `src/pages/NewLanding.tsx` only -- add benefits array to each offer object, add flip state + toggle, restructure card markup with front/back faces

