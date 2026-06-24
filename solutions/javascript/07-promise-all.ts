export function promiseAll<T>(
  values: Iterable<T | PromiseLike<T>>,
): Promise<Awaited<T>[]> {
  return new Promise((resolve, reject) => {
    const inputs = Array.from(values);
    if (!inputs.length) return resolve([]);
    const output: Awaited<T>[] = new Array(inputs.length);
    let completed = 0;
    inputs.forEach((value, index) =>
      Promise.resolve(value).then((result) => {
        output[index] = result as Awaited<T>;
        if (++completed === inputs.length) resolve(output);
      }, reject),
    );
  });
}
