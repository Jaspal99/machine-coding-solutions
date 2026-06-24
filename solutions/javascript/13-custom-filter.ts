export function customFilter<T>(
  items: T[],
  callback: (value: T, index: number, array: T[]) => boolean,
): T[] {
  const output: T[] = [];
  for (let index = 0; index < items.length; index++)
    if (index in items && callback(items[index], index, items))
      output.push(items[index]);
  return output;
}
