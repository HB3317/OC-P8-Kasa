"use client";

import { useState, type ReactNode } from "react";
import styles from "@/styles/molecules/Collapse.module.css";

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function Collapse({
  title,
  children,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.collapse}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span>{title}</span>
        <span
          className={`${styles.chevron} ${open ? styles.open : ""}`}
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>

      <div
        className={`${styles.panel} ${open ? styles.expanded : ""}`}
        inert={!open}
      >
        <div className={styles.panelInner}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
