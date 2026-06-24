"use client";
import { useEffect, useState } from "react";
type User = { id: number; name: string; email: string };
export default function PaginationTable() {
  const [rows, setRows] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const pages = Math.max(1, Math.ceil(total / size));
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`/api/users?page=${page}&size=${size}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setRows(d.items);
        setTotal(d.total);
      })
      .catch((e) => e?.name !== "AbortError" && setError(true))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [page, size]);
  return (
    <section>
      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p role="alert">Could not load users.</p>
      ) : rows.length ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users.</p>
      )}
      <button onClick={() => setPage(1)} disabled={page === 1}>
        First
      </button>
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>
        Page {page} of {pages}; {total} results
      </span>
      <button onClick={() => setPage((p) => p + 1)} disabled={page === pages}>
        Next
      </button>
      <button onClick={() => setPage(pages)} disabled={page === pages}>
        Last
      </button>
      <select
        value={size}
        onChange={(e) => {
          setSize(+e.target.value);
          setPage(1);
        }}
      >
        {[10, 25, 50].map((n) => (
          <option key={n}>{n}</option>
        ))}
      </select>
    </section>
  );
}
