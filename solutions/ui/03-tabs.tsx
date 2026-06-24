"use client";
import { ReactNode, useState } from "react";
type Tab = { id: string; label: string; content: ReactNode };
export default function Tabs({
  tabs,
  value,
  onChange,
  lazy = true,
}: {
  tabs: Tab[];
  value?: string;
  onChange?: (id: string) => void;
  lazy?: boolean;
}) {
  const [internal, setInternal] = useState(tabs[0]?.id);
  const active = value ?? internal;
  const select = (id: string) => {
    setInternal(id);
    onChange?.(id);
  };
  return (
    <div>
      <div
        role="tablist"
        onKeyDown={(e) => {
          const i = tabs.findIndex((t) => t.id === active);
          if (e.key === "ArrowRight") select(tabs[(i + 1) % tabs.length].id);
          if (e.key === "ArrowLeft")
            select(tabs[(i - 1 + tabs.length) % tabs.length].id);
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            aria-controls={`${t.id}-panel`}
            onClick={() => select(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map(
        (t) =>
          (!lazy || active === t.id) && (
            <section
              key={t.id}
              id={`${t.id}-panel`}
              role="tabpanel"
              hidden={active !== t.id}
            >
              {t.content}
            </section>
          ),
      )}
    </div>
  );
}
