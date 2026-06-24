"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
type Message = {
  id: string;
  author: "me" | "other";
  text: string;
  sentAt: string;
  pending?: boolean;
};
export default function ChatUI({
  send,
}: {
  send: (text: string) => Promise<void>;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(
    () => end.current?.scrollIntoView({ behavior: "smooth" }),
    [messages],
  );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("message")).trim();
    if (!text) return;
    const id = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      {
        id,
        author: "me",
        text,
        sentAt: new Date().toISOString(),
        pending: true,
      },
    ]);
    form.reset();
    try {
      await send(text);
      setMessages((m) =>
        m.map((x) => (x.id === id ? { ...x, pending: false } : x)),
      );
    } catch {
      setMessages((m) => m.filter((x) => x.id !== id));
    }
  }
  return (
    <main>
      {messages.length ? (
        <section>
          {messages.map((m) => (
            <article key={m.id} data-author={m.author}>
              <p>{m.text}</p>
              <time>{new Date(m.sentAt).toLocaleTimeString()}</time>
              {m.pending && " Sending…"}
            </article>
          ))}
          <div ref={end} />
        </section>
      ) : (
        <p>Start the conversation.</p>
      )}
      <form onSubmit={submit}>
        <input name="message" aria-label="Message" autoComplete="off" />
        <button>Send</button>
      </form>
    </main>
  );
}
