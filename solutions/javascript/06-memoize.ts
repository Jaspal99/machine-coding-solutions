export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  resolver: (...args: Parameters<T>) => string = (...args) =>
    JSON.stringify(args),
  maxSize = 100,
) {
  const cache = new Map<string, ReturnType<T>>();
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = resolver(...args);
    if (cache.has(key)) {
      const value = cache.get(key)!;
      cache.delete(key);
      cache.set(key, value);
      return value;
    }
    const value = fn(...args);
    cache.set(key, value);
    if (cache.size > maxSize) cache.delete(cache.keys().next().value!);
    return value;
  };
}
