import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { direction: "left" | "right" };

export default function ChevronIcon({ direction, ...props }: Props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {direction === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}
