import Link from "next/link";
import type { ReactNode } from "react";
import styles from "@/styles/atoms/NavLink.module.css";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function NavLink({
  href,
  children,
  isActive = false,
  onClick,
  className,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={[styles.link, className].filter(Boolean).join(" ")}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
