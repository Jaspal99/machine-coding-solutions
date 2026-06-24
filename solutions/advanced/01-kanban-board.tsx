"use client";
import { DragEvent, useEffect, useState } from "react";
type Card = { id: string; title: string };
type Column = { id: string; title: string; cards: Card[] };
export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(() =>
    JSON.parse(
      localStorage.getItem("board") ??
        '[{"id":"todo","title":"Todo","cards":[]},{"id":"doing","title":"Doing","cards":[]},{"id":"done","title":"Done","cards":[]}]',
    ),
  );
  useEffect(
    () => localStorage.setItem("board", JSON.stringify(columns)),
    [columns],
  );
  const add = (columnId: string) => {
    const title = prompt("Card title?")?.trim();
    if (title)
      setColumns((cs) =>
        cs.map((c) =>
          c.id === columnId
            ? { ...c, cards: [...c.cards, { id: crypto.randomUUID(), title }] }
            : c,
        ),
      );
  };
  const drop = (e: DragEvent, target: string) => {
    const [source, id] = e.dataTransfer.getData("text/plain").split(":");
    setColumns((cs) => {
      const card = cs
        .find((c) => c.id === source)
        ?.cards.find((x) => x.id === id);
      return card
        ? cs.map((c) =>
            c.id === source
              ? { ...c, cards: c.cards.filter((x) => x.id !== id) }
              : c.id === target
                ? { ...c, cards: [...c.cards, card] }
                : c,
          )
        : cs;
    });
  };
  return (
    <main>
      {columns.map((c) => (
        <section
          key={c.id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => drop(e, c.id)}
        >
          <h2>{c.title}</h2>
          <button onClick={() => add(c.id)}>Add card</button>
          {c.cards.map((card) => (
            <article
              key={card.id}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", `${c.id}:${card.id}`)
              }
            >
              {card.title}
              <button
                onClick={() => {
                  const title = prompt("Edit", card.title);
                  if (title)
                    setColumns((cs) =>
                      cs.map((x) => ({
                        ...x,
                        cards: x.cards.map((k) =>
                          k.id === card.id ? { ...k, title } : k,
                        ),
                      })),
                    );
                }}
              >
                Edit
              </button>
              <button
                onClick={() =>
                  setColumns((cs) =>
                    cs.map((x) => ({
                      ...x,
                      cards: x.cards.filter((k) => k.id !== card.id),
                    })),
                  )
                }
              >
                Delete
              </button>
            </article>
          ))}
          {!c.cards.length && <p>Drop cards here.</p>}
        </section>
      ))}
    </main>
  );
}
