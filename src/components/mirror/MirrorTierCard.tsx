const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

const paper = '#F4F2EE';
const blue = '#2997FF';

interface MirrorTierCardProps {
  pillarName: string;
  copy: string;
}

const MirrorTierCard = ({ pillarName, copy }: MirrorTierCardProps) => (
  <div
    style={{
      borderLeft: `3px solid ${blue}`,
      padding: '28px 28px 32px',
      background: 'rgba(255,255,255,0.04)',
      maxWidth: 720,
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
        marginBottom: 12,
      }}
    >
      / Your Weakest Pillar
    </p>
    <h3
      style={{
        fontFamily: display,
        fontSize: 'clamp(28px, 4.6vw, 44px)',
        lineHeight: 0.95,
        letterSpacing: '-0.01em',
        color: paper,
        textTransform: 'uppercase',
        margin: 0,
        marginBottom: 18,
        fontWeight: 400,
      }}
    >
      {pillarName}
    </h3>
    <p
      style={{
        fontFamily: body,
        fontSize: 17,
        fontWeight: 400,
        lineHeight: 1.55,
        color: paper,
        opacity: 0.92,
        margin: 0,
      }}
    >
      {copy}
    </p>
  </div>
);

export default MirrorTierCard;
