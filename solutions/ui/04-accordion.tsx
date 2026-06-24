"use client";
import { ReactNode, useState } from "react";
type Item = { id: string; title: string; content: ReactNode };
export default function Accordion({
  items,
  multiple = false,
}: {
  items: Item[];
  multiple?: boolean;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setOpen((old) => {
      const next = multiple ? new Set(old) : new Set<string>();
      if (!old.has(id)) next.add(id);
      else next.delete(id);
      return next;
    });
  return (
    <div>
      {items.map((item) => (
        <section key={item.id}>
          <h3>
            <button
              aria-expanded={open.has(item.id)}
              aria-controls={`${item.id}-content`}
              onClick={() => toggle(item.id)}
            >
              {item.title}
            </button>
          </h3>
          <div id={`${item.id}-content`} hidden={!open.has(item.id)}>
            {item.content}
          </div>
        </section>
      ))}
    </div>
  );
}
