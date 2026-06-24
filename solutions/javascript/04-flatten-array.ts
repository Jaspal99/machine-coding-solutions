export function flatten<T>(input: unknown[], depth = Infinity): T[] {
  const result: T[] = [];
  const visit = (items: unknown[], level: number) =>
    items.forEach((item) =>
      Array.isArray(item) && level > 0
        ? visit(item, level - 1)
        : result.push(item as T),
    );
  visit(input, depth);
  return result;
}
