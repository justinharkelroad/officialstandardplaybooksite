import { cn } from "@/lib/utils";

// The landing page's signature rotated brand band, reused as a section divider
// in the member app. Ink band + paper type in light; inverts with the theme.
type MarqueeBandProps = {
  phrase?: string;
  rotate?: number;
  className?: string;
};

export function MarqueeBand({
  phrase = "BODY · BEING · BALANCE · BUSINESS",
  rotate = -2,
  className,
}: MarqueeBandProps) {
  // Duplicated set: the track translates -50%, so two copies loop seamlessly.
  const items = Array.from({ length: 12 });

  return (
    <div className={cn("sp-marquee-wrap", className)} aria-hidden>
      <div className="sp-marquee" style={{ transform: `rotate(${rotate}deg)` }}>
        <div className="sp-marquee-track">
          {items.map((_, i) => (
            <span key={i} className="sp-marquee-item">
              <span>{phrase}</span>
              <span className="sp-marquee-dot" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
