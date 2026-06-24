export function groupBy<T>(
  items: T[],
  selector: keyof T | ((item: T) => PropertyKey),
) {
  return items.reduce<Record<PropertyKey, T[]>>((groups, item) => {
    const key =
      typeof selector === "function"
        ? selector(item)
        : String(item[selector] ?? "undefined");
    (groups[key] ??= []).push(item);
    return groups;
  }, {});
}
