// Stub: the source platform's HelpButton reads admin-managed help content
// (videos/PDF walkthroughs) from a help-content table that is not part of
// this app (logged as future work in the transplant report). Keeping the
// component surface so transplanted pages render unchanged.
interface HelpButtonProps {
  videoKey: string;
  label?: string;
  className?: string;
}

export function HelpButton(_props: HelpButtonProps) {
  return null;
}
