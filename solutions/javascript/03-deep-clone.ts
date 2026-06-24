export function deepClone<T>(
  value: T,
  seen = new WeakMap<object, unknown>(),
): T {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return new Date(value) as T;
  if (seen.has(value)) return seen.get(value) as T;
  const output: any = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(value));
  seen.set(value, output);
  Reflect.ownKeys(value).forEach(
    (key) => (output[key] = deepClone((value as any)[key], seen)),
  );
  return output;
}
