export function customReduce<T, U>(
  items: T[],
  callback: (accumulator: U, value: T, index: number, array: T[]) => U,
  initial?: U,
): U {
  let index = 0;
  let accumulator: U;
  if (arguments.length >= 3) accumulator = initial as U;
  else {
    while (index < items.length && !(index in items)) index++;
    if (index >= items.length)
      throw new TypeError("Reduce of empty array with no initial value");
    accumulator = items[index++] as unknown as U;
  }
  for (; index < items.length; index++)
    if (index in items)
      accumulator = callback(accumulator, items[index], index, items);
  return accumulator;
}
