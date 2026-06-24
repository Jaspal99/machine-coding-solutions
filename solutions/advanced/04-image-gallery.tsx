"use client";
import { useEffect, useState } from "react";
type Image = { id: string; src: string; alt: string };
export default function ImageGallery({ images }: { images: Image[] }) {
  const [active, setActive] = useState<number | null>(null);
  const move = (n: number) =>
    setActive((i) =>
      i === null ? null : (i + n + images.length) % images.length,
    );
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  });
  return (
    <main>
      <div>
        {images.map((image, i) => (
          <button key={image.id} onClick={() => setActive(i)}>
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/fallback.png";
              }}
            />
          </button>
        ))}
      </div>
      {active !== null && (
        <div role="dialog" aria-modal="true">
          <button onClick={() => setActive(null)}>Close</button>
          <button onClick={() => move(-1)}>Previous</button>
          <img src={images[active].src} alt={images[active].alt} />
          <button onClick={() => move(1)}>Next</button>
        </div>
      )}
    </main>
  );
}
