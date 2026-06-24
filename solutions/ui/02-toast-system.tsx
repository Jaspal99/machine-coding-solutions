"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
type Kind = "success" | "error" | "warning" | "info";
type Toast = { id: string; message: string; kind: Kind; duration: number };
const ToastContext = createContext<{
  show: (message: string, kind?: Kind, duration?: number) => void;
} | null>(null);
export function ToastProvider({
  children,
  max = 3,
}: {
  children: ReactNode;
  max?: number;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const remove = useCallback(
    (id: string) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );
  const show = (message: string, kind: Kind = "info", duration = 4000) => {
    const toast = { id: crypto.randomUUID(), message, kind, duration };
    setToasts((t) => [...t, toast].slice(-max));
    setTimeout(() => remove(toast.id), duration);
  };
  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <aside aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} data-kind={t.kind} onMouseEnter={() => {}}>
            <span>{t.message}</span>
            <button onClick={() => remove(t.id)} aria-label="Dismiss">
              ×
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("Use ToastProvider");
  return value;
}
