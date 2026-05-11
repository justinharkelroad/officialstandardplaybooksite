const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

const paper = '#F4F2EE';
const blue = '#2997FF';

export interface PillarRow {
  key: string;
  name: string;
  score: number;
  max: number;
}

interface MirrorPillarBarsProps {
  rows: PillarRow[];
  weakestKey: string;
  /** Render against the dark canvas (results page) */
  onInk?: boolean;
}

const MirrorPillarBars = ({ rows, weakestKey, onInk = true }: MirrorPillarBarsProps) => {
  const fg = onInk ? paper : '#0A0A0B';
  const muted = onInk ? `${paper}33` : '#0A0A0B1a';

  return (
    <div style={{ width: '100%' }}>
      {rows.map((r) => {
        const isWeakest = r.key === weakestKey;
        const pct = Math.max(0, Math.min(1, r.score / r.max));
        return (
          <div key={r.key} style={{ padding: '18px 0', borderBottom: `1px solid ${muted}` }}>
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-12 md:col-span-4">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <p
                    style={{
                      fontFamily: body,
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      color: fg,
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    {r.name}
                  </p>
                  {isWeakest && (
                    <span
                      style={{
                        fontFamily: body,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: blue,
                        textTransform: 'uppercase',
                        border: `1px solid ${blue}`,
                        padding: '3px 6px',
                      }}
                    >
                      Weakest
                    </span>
                  )}
                </div>
              </div>

              <div className="col-span-9 md:col-span-6">
                <div
                  style={{
                    height: 14,
                    background: muted,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pct * 100}%`,
                      height: '100%',
                      background: isWeakest ? blue : fg,
                      opacity: isWeakest ? 1 : 0.85,
                      transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />
                </div>
              </div>

              <div className="col-span-3 md:col-span-2 text-right">
                <span
                  style={{
                    fontFamily: display,
                    fontSize: 22,
                    color: fg,
                    letterSpacing: '-0.01em',
                    fontWeight: 400,
                  }}
                >
                  {r.score}
                  <span style={{ fontFamily: body, fontSize: 12, fontWeight: 500, opacity: 0.55, marginLeft: 4 }}>
                    / {r.max}
                  </span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MirrorPillarBars;
