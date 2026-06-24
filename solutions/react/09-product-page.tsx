"use client";
import { useState } from "react";
type Product = {
  title: string;
  price: number;
  originalPrice: number;
  images: string[];
  sizes: string[];
  description: string;
};
export default function ProductPage({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (size: string, quantity: number) => void;
}) {
  const [image, setImage] = useState(0);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  return (
    <main>
      <nav aria-label="Breadcrumb">Home / Products / {product.title}</nav>
      <img
        src={product.images[image]}
        alt={product.title}
        onError={(e) => {
          e.currentTarget.src = "/fallback.png";
        }}
      />
      <div>
        {product.images.map((src, i) => (
          <button
            key={src}
            onClick={() => setImage(i)}
            aria-label={`View image ${i + 1}`}
          >
            <img src={src} alt="" width="64" />
          </button>
        ))}
      </div>
      <h1>{product.title}</h1>
      <p>
        <strong>${product.price}</strong> <s>${product.originalPrice}</s>
      </p>
      <fieldset>
        <legend>Size</legend>
        {product.sizes.map((s) => (
          <label key={s}>
            <input
              type="radio"
              name="size"
              checked={size === s}
              onChange={() => setSize(s)}
            />
            {s}
          </label>
        ))}
      </fieldset>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
        aria-label="Quantity"
      />
      <button disabled={!size} onClick={() => onAdd(size, quantity)}>
        Add to cart
      </button>
      <section>
        <h2>Description</h2>
        <p>{product.description}</p>
      </section>
      <section>
        <h2>Reviews</h2>
        <p>No reviews yet.</p>
      </section>
    </main>
  );
}
