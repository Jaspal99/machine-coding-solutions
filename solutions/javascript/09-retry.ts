export async function retry<T>(
  operation: (signal?: AbortSignal) => Promise<T>,
  retries = 3,
  baseDelay = 250,
  signal?: AbortSignal,
): Promise<T> {
  let error: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    signal?.throwIfAborted();
    try {
      return await operation(signal);
    } catch (caught) {
      error = caught;
      if (attempt === retries) break;
      await new Promise((resolve, reject) => {
        const id = setTimeout(resolve, baseDelay * 2 ** attempt);
        signal?.addEventListener(
          "abort",
          () => {
            clearTimeout(id);
            reject(signal.reason);
          },
          { once: true },
        );
      });
    }
  }
  throw error;
}
