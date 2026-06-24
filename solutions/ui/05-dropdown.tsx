"use client";
import { useEffect, useRef, useState } from "react";
type Option = { value: string; label: string; disabled?: boolean };
export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select",
}: {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);
  useEffect(() => {
    const close = (e: MouseEvent) =>
      !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const choose = (o: Option) => {
    if (!o.disabled) {
      onChange(o.value);
      setOpen(false);
    }
  };
  return (
    <div ref={root}>
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((x) => !x)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "ArrowDown") {
            setOpen(true);
            setActive((i) => Math.min(i + 1, options.length - 1));
          }
          if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
          if (e.key === "Enter" && open) choose(options[active]);
        }}
      >
        {selected?.label ?? placeholder}
      </button>
      {open && (
        <ul role="listbox">
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              aria-disabled={o.disabled}
              data-active={i === active}
              onMouseDown={() => choose(o)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
