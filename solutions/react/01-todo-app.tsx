"use client";
import { FormEvent, useEffect, useMemo, useReducer, useState } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  priority: "low" | "medium" | "high";
};
type Action =
  | { type: "add"; text: string }
  | { type: "toggle" | "remove"; id: string }
  | { type: "edit"; id: string; text: string }
  | { type: "clear" };

function reducer(state: Todo[], action: Action): Todo[] {
  if (action.type === "add")
    return state.some((t) => t.text.toLowerCase() === action.text.toLowerCase())
      ? state
      : [
          ...state,
          {
            id: crypto.randomUUID(),
            text: action.text,
            done: false,
            priority: "medium",
          },
        ];
  if (action.type === "toggle")
    return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
  if (action.type === "remove") return state.filter((t) => t.id !== action.id);
  if (action.type === "edit")
    return state.map((t) =>
      t.id === action.id ? { ...t, text: action.text } : t,
    );
  return state.filter((t) => !t.done);
}

export default function TodoApp() {
  const [todos, dispatch] = useReducer(reducer, [], () =>
    JSON.parse(localStorage.getItem("todos") ?? "[]"),
  );
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [query, setQuery] = useState("");
  useEffect(
    () => localStorage.setItem("todos", JSON.stringify(todos)),
    [todos],
  );
  const visible = useMemo(
    () =>
      todos.filter(
        (t) =>
          (filter === "all" || (filter === "completed") === t.done) &&
          t.text.toLowerCase().includes(query.toLowerCase()),
      ),
    [todos, filter, query],
  );
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = String(data.get("todo")).trim();
    if (text) {
      dispatch({ type: "add", text });
      e.currentTarget.reset();
    }
  }
  return (
    <main>
      <form onSubmit={submit}>
        <input name="todo" aria-label="New todo" />
        <button>Add</button>
      </form>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
      />
      <nav>
        {(["all", "active", "completed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </nav>
      {visible.length ? (
        <ul>
          {visible.map((t) => (
            <li key={t.id}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => dispatch({ type: "toggle", id: t.id })}
              />
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  dispatch({
                    type: "edit",
                    id: t.id,
                    text: e.currentTarget.textContent ?? "",
                  })
                }
              >
                {t.text}
              </span>
              <button onClick={() => dispatch({ type: "remove", id: t.id })}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No todos.</p>
      )}
      <button onClick={() => dispatch({ type: "clear" })}>
        Clear completed
      </button>
    </main>
  );
}
