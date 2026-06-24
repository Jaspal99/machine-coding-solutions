export function customMap<T, U>(
  items: T[],
  callback: (value: T, index: number, array: T[]) => U,
): U[] {
  const output = new Array<U>(items.length);
  for (let index = 0; index < items.length; index++)
    if (index in items) output[index] = callback(items[index], index, items);
  return output;
}
