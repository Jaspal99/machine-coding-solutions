"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Page = { items: string[]; nextCursor: string | null };
export default function InfiniteScroll() {
  const [items, setItems] = useState<string[]>([]);
  const [cursor, setCursor] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const load = useCallback(async () => {
    if (loading || cursor === null) return;
    setLoading(true);
    setError(false);
    try {
      const r = await fetch(`/api/items?cursor=${cursor}`);
      if (!r.ok) throw new Error();
      const p: Page = await r.json();
      setItems((old) => [...old, ...p.items.filter((x) => !old.includes(x))]);
      setCursor(p.nextCursor);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);
  useEffect(() => {
    const node = sentinel.current;
    const observer = new IntersectionObserver(
      (e) => e[0].isIntersecting && load(),
    );
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [load]);
  return (
    <section>
      {items.map((x) => (
        <article key={x}>{x}</article>
      ))}
      {loading && <p>Loading…</p>}
      {error && <button onClick={load}>Retry</button>}
      {cursor === null && <p>End of list.</p>}
      <div ref={sentinel} />
    </section>
  );
}
