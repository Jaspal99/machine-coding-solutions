"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
type Product = { id: number; name: string; price: number; stock: number };
type Line = Product & { quantity: number };
type Action =
  | { type: "add"; product: Product }
  | { type: "remove" | "increment" | "decrement"; id: number };
function reducer(lines: Line[], action: Action): Line[] {
  if (action.type === "add")
    return lines.some((x) => x.id === action.product.id)
      ? lines.map((x) =>
          x.id === action.product.id
            ? { ...x, quantity: Math.min(x.stock, x.quantity + 1) }
            : x,
        )
      : [...lines, { ...action.product, quantity: 1 }];
  if (action.type === "remove") return lines.filter((x) => x.id !== action.id);
  return lines.map((x) =>
    x.id === action.id
      ? {
          ...x,
          quantity:
            action.type === "increment"
              ? Math.min(x.stock, x.quantity + 1)
              : Math.max(1, x.quantity - 1),
        }
      : x,
  );
}
const CartContext = createContext<ReturnType<typeof useCart> | null>(null);
function useCart() {
  const [lines, dispatch] = useReducer(reducer, [], () =>
    JSON.parse(localStorage.getItem("cart") ?? "[]"),
  );
  useEffect(() => localStorage.setItem("cart", JSON.stringify(lines)), [lines]);
  return { lines, dispatch };
}
export function CartProvider({ children }: { children: ReactNode }) {
  return (
    <CartContext.Provider value={useCart()}>{children}</CartContext.Provider>
  );
}
export default function ShoppingCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("Wrap in CartProvider");
  const subtotal = cart.lines.reduce((sum, x) => sum + x.price * x.quantity, 0);
  const discount = subtotal >= 200 ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  return (
    <section>
      <h1>Cart ({cart.lines.reduce((n, x) => n + x.quantity, 0)})</h1>
      {cart.lines.length ? (
        cart.lines.map((x) => (
          <article key={x.id}>
            {x.name}: ${x.price * x.quantity}
            <button
              onClick={() => cart.dispatch({ type: "decrement", id: x.id })}
            >
              −
            </button>
            {x.quantity}
            <button
              disabled={x.quantity === x.stock}
              onClick={() => cart.dispatch({ type: "increment", id: x.id })}
            >
              +
            </button>
            <button onClick={() => cart.dispatch({ type: "remove", id: x.id })}>
              Remove
            </button>
          </article>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
      <strong>Total: ${(subtotal - discount + tax).toFixed(2)}</strong>
    </section>
  );
}
