"use client";
import { useMemo, useState } from "react";
type Notification = {
  id: string;
  text: string;
  read: boolean;
  createdAt: string;
};
export default function NotificationCenter({
  initial,
}: {
  initial: Notification[];
}) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const visible = useMemo(
    () =>
      items.filter((x) => filter === "all" || (filter === "read") === x.read),
    [items, filter],
  );
  const unread = items.filter((x) => !x.read).length;
  return (
    <main>
      <h1>Notifications ({unread} unread)</h1>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value as typeof filter)}
      >
        <option value="all">All</option>
        <option value="unread">Unread</option>
        <option value="read">Read</option>
      </select>
      <button
        onClick={() => setItems((xs) => xs.map((x) => ({ ...x, read: true })))}
      >
        Mark all read
      </button>
      {visible.length ? (
        visible.map((n) => (
          <article key={n.id}>
            <p>{n.text}</p>
            <time>{new Date(n.createdAt).toLocaleString()}</time>
            {!n.read && (
              <button
                onClick={() =>
                  setItems((xs) =>
                    xs.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                  )
                }
              >
                Mark read
              </button>
            )}
            <button
              onClick={() => setItems((xs) => xs.filter((x) => x.id !== n.id))}
            >
              Delete
            </button>
          </article>
        ))
      ) : (
        <p>No notifications.</p>
      )}
    </main>
  );
}
