"use client";
import { useMemo, useState } from "react";
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  popularity: number;
};
const products: Product[] = [
  {
    id: 1,
    name: "Keyboard",
    category: "Tech",
    price: 80,
    rating: 4.5,
    popularity: 8,
  },
  {
    id: 2,
    name: "Chair",
    category: "Home",
    price: 140,
    rating: 4.2,
    popularity: 10,
  },
];
export default function ProductListing() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [max, setMax] = useState(500);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const shown = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q.toLowerCase()) &&
            (!category || p.category === category) &&
            p.price <= max &&
            p.rating >= rating,
        )
        .sort((a, b) =>
          sort === "low"
            ? a.price - b.price
            : sort === "high"
              ? b.price - a.price
              : b.popularity - a.popularity,
        ),
    [q, category, max, rating, sort],
  );
  return (
    <main>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All categories</option>
        <option>Tech</option>
        <option>Home</option>
      </select>
      <input
        type="range"
        min="0"
        max="500"
        value={max}
        onChange={(e) => setMax(+e.target.value)}
        aria-label="Maximum price"
      />
      <select value={rating} onChange={(e) => setRating(+e.target.value)}>
        <option value="0">Any rating</option>
        <option value="4">4+</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="popular">Popular</option>
        <option value="low">Price low-high</option>
        <option value="high">Price high-low</option>
      </select>
      <button
        onClick={() => {
          setQ("");
          setCategory("");
          setMax(500);
          setRating(0);
        }}
      >
        Clear filters
      </button>
      {shown.length ? (
        <div>
          {shown.map((p) => (
            <article key={p.id}>
              <h2>{p.name}</h2>
              <p>${p.price}</p>
            </article>
          ))}
        </div>
      ) : (
        <p>No matching products.</p>
      )}
    </main>
  );
}
