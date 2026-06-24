type Settled<T> =
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; reason: unknown };
export function promiseAllSettled<T>(
  values: Iterable<T | PromiseLike<T>>,
): Promise<Settled<Awaited<T>>[]> {
  return Promise.all(
    Array.from(values, (value) =>
      Promise.resolve(value)
        .then<Settled<Awaited<T>>>((result) => ({
          status: "fulfilled",
          value: result as Awaited<T>,
        }))
        .catch<Settled<Awaited<T>>>((reason) => ({
          status: "rejected",
          reason,
        })),
    ),
  );
}
