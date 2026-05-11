const ink = '#0A0A0B';
const blue = '#2997FF';

interface MirrorProgressBarProps {
  /** 0..1 progress fraction */
  progress: number;
  thickness?: number;
}

const MirrorProgressBar = ({ progress, thickness = 3 }: MirrorProgressBarProps) => {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      style={{
        width: '100%',
        height: thickness,
        background: `${ink}1a`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: blue,
          transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
};

export default MirrorProgressBar;
