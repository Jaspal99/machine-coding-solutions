"use client";
import { FormEvent, useState } from "react";
type Mode = "login" | "signup";
export default function AuthFlow({
  authenticate,
}: {
  authenticate: (data: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<string>;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;
    if (!/^\S+@\S+\.\S+$/.test(data.email))
      return setError("Enter a valid email.");
    if (data.password.length < 8)
      return setError("Password must contain at least 8 characters.");
    setLoading(true);
    setError("");
    try {
      const token = await authenticate({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      sessionStorage.setItem("session", token);
      location.assign("/dashboard");
    } catch (e) {
      setError((e as Error).message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main>
      <div role="tablist">
        <button onClick={() => setMode("login")}>Login</button>
        <button onClick={() => setMode("signup")}>Sign up</button>
      </div>
      <form onSubmit={submit}>
        {mode === "signup" && (
          <label>
            Name
            <input name="name" required />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" minLength={8} required />
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={loading}>{loading ? "Please wait…" : mode}</button>
      </form>
    </main>
  );
}
export function requireSession() {
  if (!sessionStorage.getItem("session")) location.replace("/login");
}
export function logout() {
  sessionStorage.removeItem("session");
  location.assign("/login");
}
