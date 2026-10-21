"use client";

import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import Image from "next/image";
import CloseIcon from "@/components/quarks/CloseIcon";
import ChevronIcon from "@/components/quarks/ChevronIcon";
import styles from "@/styles/molecules/PropertyLightbox.module.css";

type Props = {
  images: string[];
  title: string;
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};

export default function PropertyLightbox({ images, title, activeIndex, onPrevious, onNext, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    closeRef.current?.focus();
    return () => { if (dialog.open) dialog.close(); };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Tab") {
      // Only the lightbox controls participate in its keyboard tab order.
      const controls = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])")
      );
      if (controls.length === 0) return;

      const first = controls[0];
      const last = controls[controls.length - 1];
      const current = document.activeElement;
      if (!controls.some((button) => button === current)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }

    if (images.length <= 1) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); onPrevious(); }
    if (event.key === "ArrowRight") { event.preventDefault(); onNext(); }
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={`Photos agrandies : ${title}`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.viewer}>
        <button ref={closeRef} type="button" className={styles.close} aria-label="Fermer la visionneuse" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className={styles.photo}>
          <Image
            src={images[activeIndex]}
            alt={`${title} — photo ${activeIndex + 1} sur ${images.length}`}
            fill
            sizes="95vw"
            className={styles.image}
          />
        </div>
        {images.length > 1 && (
          <>
            <button type="button" className={`${styles.arrow} ${styles.previous}`} aria-label="Photo précédente" onClick={onPrevious}>
              <ChevronIcon direction="left" />
            </button>
            <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Photo suivante" onClick={onNext}>
              <ChevronIcon direction="right" />
            </button>
            <span className={styles.counter} aria-live="polite">{activeIndex + 1} / {images.length}</span>
          </>
        )}
      </div>
    </dialog>
  );
}
