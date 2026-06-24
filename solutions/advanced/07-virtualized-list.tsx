"use client";
import { UIEvent, useMemo, useState } from "react";
const ITEM_HEIGHT = 40;
export default function VirtualizedList({
  items,
  height = 400,
  overscan = 5,
}: {
  items: string[];
  height?: number;
  overscan?: number;
}) {
  const [top, setTop] = useState(0);
  const range = useMemo(() => {
    const start = Math.max(0, Math.floor(top / ITEM_HEIGHT) - overscan);
    const end = Math.min(
      items.length,
      Math.ceil((top + height) / ITEM_HEIGHT) + overscan,
    );
    return { start, end };
  }, [top, height, items.length, overscan]);
  return (
    <div
      style={{ height, overflow: "auto" }}
      onScroll={(e: UIEvent<HTMLDivElement>) =>
        setTop(e.currentTarget.scrollTop)
      }
      tabIndex={0}
    >
      <div style={{ height: items.length * ITEM_HEIGHT, position: "relative" }}>
        {items.slice(range.start, range.end).map((item, i) => (
          <div
            key={range.start + i}
            style={{
              position: "absolute",
              top: (range.start + i) * ITEM_HEIGHT,
              height: ITEM_HEIGHT,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
