"use client";
import { useEffect, useRef, useState } from "react";

type Suggestion = { id: number; label: string };
const cache = new Map<string, Suggestion[]>();

export default function SearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (query.trim().length < 2) {
      setItems([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const key = query.toLowerCase();
      if (cache.has(key)) return setItems(cache.get(key)!);
      setStatus("loading");
      try {
        const response = await fetch(
          `/api/suggestions?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error();
        const data: Suggestion[] = await response.json();
        cache.set(key, data);
        setItems(data);
        setStatus("idle");
      } catch (error) {
        if ((error as Error).name !== "AbortError") setStatus("error");
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  useEffect(() => {
    const close = (e: MouseEvent) =>
      !box.current?.contains(e.target as Node) && setItems([]);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  return (
    <div ref={box} role="combobox" aria-expanded={items.length > 0}>
      <input
        value={query}
        aria-autocomplete="list"
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(-1);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown")
            setActive((i) => Math.min(i + 1, items.length - 1));
          if (e.key === "ArrowUp") setActive((i) => Math.max(i - 1, 0));
          if (e.key === "Enter" && items[active]) {
            setQuery(items[active].label);
            setItems([]);
          }
          if (e.key === "Escape") setItems([]);
        }}
      />
      <button onClick={() => setQuery("")}>Clear</button>
      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p role="alert">Search failed.</p>}
      <ul role="listbox">
        {items.map((item, i) => (
          <li
            role="option"
            aria-selected={i === active}
            key={item.id}
            onMouseDown={() => {
              setQuery(item.label);
              setItems([]);
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
      {query.length >= 2 && status === "idle" && !items.length && (
        <p>No results.</p>
      )}
    </div>
  );
}
