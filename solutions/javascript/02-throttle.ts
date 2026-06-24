export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  let waiting = false;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (waiting) return;
    fn.apply(this, args);
    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, delay);
  };
}
