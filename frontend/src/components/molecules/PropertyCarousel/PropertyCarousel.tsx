"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import PropertyLightbox from "@/components/molecules/PropertyLightbox/PropertyLightbox";
import ChevronIcon from "@/components/quarks/ChevronIcon";
import Image from "next/image";
import styles from "@/styles/molecules/PropertyCarousel.module.css";

type Props = {
  images: string[];
  title: string;
  children?: ReactNode;
};

export default function PropertyCarousel({ images, title, children }: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);

  const count = images.length;
  const activeIndex = count > 0 ? index % count : 0;

  const thumbnails = Array.from(
    { length: Math.min(4, Math.max(0, count - 1)) },
    (_, position) => (activeIndex + position + 1) % count
  );

  function previous() {
    if (count <= 1) return;
    setIndex((current) => (current - 1 + count) % count);
  }

  function next() {
    if (count <= 1) return;
    setIndex((current) => (current + 1) % count);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (count <= 1 || lightboxOpen) return;
    if ((event.target as HTMLElement).closest(`.${styles.actions}`)) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  }

  return (
    <section
      className={styles.carousel}
      aria-label={`Photos du logement : ${title}`}
      aria-roledescription="carrousel"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.mainPicture}>
        {count > 0 ? (
          <button
            ref={openerRef}
            type="button"
            className={styles.openPicture}
            onClick={() => setLightboxOpen(true)}
            aria-label="Agrandir la photo principale"
          >
            <Image
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${title} — photo ${activeIndex + 1} sur ${count}`}
              fill
              sizes="(max-width: 800px) calc(100vw - 32px), 550px"
              className={styles.image}
              priority={activeIndex === 0}
            />
          </button>
        ) : (
          <p className={styles.placeholder}>Photo indisponible</p>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.previous}`}
              onClick={previous}
              aria-label="Photo précédente"
            >
              <ChevronIcon direction="left" />
            </button>

            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              onClick={next}
              aria-label="Photo suivante"
            >
              <ChevronIcon direction="right" />
            </button>

            <span className={styles.counter} aria-live="polite" aria-atomic="true">
              {activeIndex + 1} / {count}
            </span>
          </>
        )}

        {children && <div className={styles.actions}>{children}</div>}
      </div>

      {thumbnails.map((pictureIndex) => (
        <button
          key={pictureIndex}
          type="button"
          className={styles.thumbnail}
          onClick={() => setIndex(pictureIndex)}
          aria-label={`Afficher la photo ${pictureIndex + 1} sur ${count}`}
        >
          <Image
            src={images[pictureIndex]}
            alt=""
            fill
            sizes="(max-width: 800px) 25vw, 180px"
            className={styles.thumbnailImage}
          />
        </button>
      ))}
      {lightboxOpen && (
        <PropertyLightbox
          images={images}
          title={title}
          activeIndex={activeIndex}
          onPrevious={previous}
          onNext={next}
          onClose={() => {
            setLightboxOpen(false);
            requestAnimationFrame(() => openerRef.current?.focus());
          }}
        />
      )}
    </section>
  );
}
