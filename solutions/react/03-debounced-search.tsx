"use client";
import { useEffect, useState } from "react";

export default function DebouncedSearch() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  useEffect(() => {
    if (!input.trim()) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setState("loading");
      try {
        const r = await fetch(
          `/api/search?q=${encodeURIComponent(input)}&page=${page}`,
          { signal: controller.signal },
        );
        if (!r.ok) throw new Error();
        setResults(await r.json());
        setState("idle");
      } catch (e) {
        if ((e as Error).name !== "AbortError") setState("error");
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [input, page]);
  return (
    <section>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setPage(1);
        }}
      />
      <button onClick={() => setInput("")}>Clear</button>
      {state === "loading" && <p>Loading…</p>}
      {state === "error" && <p role="alert">Try again.</p>}
      {state === "idle" && input && !results.length && <p>No results.</p>}
      <ul>
        {results.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
        Previous
      </button>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </section>
  );
}
