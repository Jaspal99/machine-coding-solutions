"use client";
import { useMemo, useState } from "react";
type Row = { name: string; score: number; joined: string };
type Key = keyof Row;
type Direction = "asc" | "desc" | null;
const data: Row[] = [
  { name: "Asha", score: 92, joined: "2025-01-10" },
  { name: "Ravi", score: 78, joined: "2024-08-02" },
];
export default function SortableTable() {
  const [sort, setSort] = useState<{ key: Key; direction: Direction }>({
    key: "name",
    direction: null,
  });
  const rows = useMemo(
    () =>
      sort.direction
        ? [...data].sort((a, b) => {
            const result =
              sort.key === "joined"
                ? Date.parse(a.joined) - Date.parse(b.joined)
                : typeof a[sort.key] === "number"
                  ? Number(a[sort.key]) - Number(b[sort.key])
                  : String(a[sort.key]).localeCompare(String(b[sort.key]));
            return sort.direction === "asc" ? result : -result;
          })
        : data,
    [sort],
  );
  const cycle = (key: Key) =>
    setSort((s) => ({
      key,
      direction:
        s.key !== key
          ? "asc"
          : s.direction === "asc"
            ? "desc"
            : s.direction === "desc"
              ? null
              : "asc",
    }));
  return (
    <table>
      <thead>
        <tr>
          {(["name", "score", "joined"] as Key[]).map((k) => (
            <th key={k}>
              <button onClick={() => cycle(k)}>
                {k} {sort.key === k ? (sort.direction ?? "") : ""}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td>{r.name}</td>
            <td>{r.score}</td>
            <td>{r.joined}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
