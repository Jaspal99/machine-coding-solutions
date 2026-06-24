"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
export default function ProductFilters() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    if (key !== "page") next.set("page", "1");
    startTransition(() => router.replace(`${pathname}?${next}`));
  };
  return (
    <form aria-busy={pending}>
      <input
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => update("q", e.target.value)}
        placeholder="Search"
      />
      <select
        value={params.get("category") ?? ""}
        onChange={(e) => update("category", e.target.value)}
      >
        <option value="">All</option>
        <option>Tech</option>
      </select>
      <select
        value={params.get("sort") ?? ""}
        onChange={(e) => update("sort", e.target.value)}
      >
        <option value="">Newest</option>
        <option value="price-asc">Price low-high</option>
      </select>
    </form>
  );
}
// In the Server Component page, read `searchParams`, validate them, and pass
// category/q/sort/page to the server-side product fetch.
