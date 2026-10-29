import type { SVGProps } from "react";

type PowerIconProps = SVGProps<SVGSVGElement>;

export default function PowerIcon(props: PowerIconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path d="M8 2.4V8.2M4.35 4.3a5.2 5.2 0 1 0 7.3 0"
        stroke="var(--color-black)" strokeWidth="1.35"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
