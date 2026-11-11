import { Link } from 'react-router-dom';

/* ── Bold editorial palette (matches the Bold program pages) ── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

interface BoardroomEntryNudgeProps {
  /** The program this page is about, e.g. "Momentum" or "Team Standard". */
  programName: string;
  /** Waitlist pages phrase it as "move up the waitlist"; call pages as "get moving now". */
  variant?: 'waitlist' | 'call';
}

/**
 * "Start here" — the Boardroom is the way into Standard. Shown on the
 * high-touch program pages (Momentum, Directive, Team Standard, Standard 90,
 * 8-Week) so the weekly group coaching reads as step one before a seat or a
 * call (Justin, 2026-11-11).
 */
const BoardroomEntryNudge = ({ programName, variant = 'call' }: BoardroomEntryNudgeProps) => (
  <section style={{ background: paper, padding: 'clamp(56px, 9vw, 96px) 24px' }}>
    <div
      style={{
        maxWidth: 1040,
        margin: '0 auto',
        border: `1.5px solid ${ink}`,
        background: '#fff',
        padding: 'clamp(28px, 5vw, 52px)',
      }}
    >
      <p
        style={{
          fontFamily: body,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: blue,
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        Start here · Step one into Standard
      </p>
      <h2
        style={{
          fontFamily: display,
          fontSize: 'clamp(34px, 5.5vw, 68px)',
          lineHeight: 0.95,
          letterSpacing: '-0.01em',
          color: ink,
          textTransform: 'uppercase',
          margin: '14px 0 0',
          fontWeight: 400,
        }}
      >
        Start in the Boardroom.
      </h2>
      <p
        style={{
          fontFamily: body,
          fontSize: 'clamp(15px, 1.5vw, 18px)',
          lineHeight: 1.55,
          color: ink,
          opacity: 0.78,
          margin: '18px 0 0',
          maxWidth: 680,
        }}
      >
        The way into Standard is the weekly Boardroom. Every week you get on a group coaching call
        with Justin and learn the systems that run a great agency.{' '}
        {variant === 'waitlist'
          ? `It is the best way to get moving now and move up the ${programName} waitlist while a seat opens.`
          : `Get moving now — it is the best on-ramp before ${programName}.`}
      </p>
      <Link
        to="/boardroom"
        className="hover:bg-[#2997FF] hover:border-[#2997FF] hover:text-white"
        style={{
          display: 'inline-block',
          marginTop: 28,
          fontFamily: body,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#fff',
          background: ink,
          border: `1.5px solid ${ink}`,
          borderRadius: 0,
          padding: '16px 30px',
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'all 0.25s',
        }}
      >
        See the Boardroom →
      </Link>
    </div>
  </section>
);

export default BoardroomEntryNudge;
