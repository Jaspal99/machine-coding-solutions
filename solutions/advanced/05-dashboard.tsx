"use client";
import { useEffect, useMemo, useState } from "react";
type Point = { date: string; revenue: number };
type Dashboard = { users: number; revenue: number; points: Point[] };
export default function Dashboard() {
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<Dashboard>();
  const [error, setError] = useState(false);
  useEffect(() => {
    const c = new AbortController();
    setError(false);
    fetch(`/api/dashboard?range=${range}`, { signal: c.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch((e) => e?.name !== "AbortError" && setError(true));
    return () => c.abort();
  }, [range]);
  const max = useMemo(
    () => Math.max(...(data?.points.map((p) => p.revenue) ?? [1])),
    [data],
  );
  if (error)
    return <button onClick={() => setRange((x) => x)}>Retry dashboard</button>;
  if (!data) return <p>Loading dashboard…</p>;
  return (
    <main>
      <select value={range} onChange={(e) => setRange(e.target.value)}>
        <option value="7d">7 days</option>
        <option value="30d">30 days</option>
      </select>
      <section>
        <article>Users: {data.users}</article>
        <article>Revenue: ${data.revenue}</article>
      </section>
      {data.points.length ? (
        <svg viewBox="0 0 100 40" role="img" aria-label="Revenue chart">
          {data.points.map((p, i) => (
            <rect
              key={p.date}
              x={i * (100 / data.points.length)}
              y={40 - (p.revenue / max) * 40}
              width={80 / data.points.length}
              height={(p.revenue / max) * 40}
            />
          ))}
        </svg>
      ) : (
        <p>No dashboard data.</p>
      )}
    </main>
  );
}
