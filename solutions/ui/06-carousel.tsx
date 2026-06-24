"use client";
import { useEffect, useState } from "react";
type Slide = { src: string; alt: string };
export default function Carousel({
  slides,
  interval = 4000,
}: {
  slides: Slide[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const move = (n: number) =>
    setIndex((i) => (i + n + slides.length) % slides.length);
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setInterval(() => move(1), interval);
    return () => clearInterval(id);
  }, [paused, interval, slides.length]);
  return (
    <section
      aria-roledescription="carousel"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") move(1);
        if (e.key === "ArrowLeft") move(-1);
      }}
    >
      <img src={slides[index].src} alt={slides[index].alt} loading="lazy" />
      <button onClick={() => move(-1)}>Previous</button>
      <button onClick={() => move(1)}>Next</button>
      <div>
        {slides.map((s, i) => (
          <button
            key={s.src}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          >
            ●
          </button>
        ))}
      </div>
    </section>
  );
}
