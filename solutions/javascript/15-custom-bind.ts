export function customBind<T extends (...args: any[]) => any>(
  fn: T,
  context: ThisParameterType<T>,
  ...bound: unknown[]
) {
  function boundFunction(this: unknown, ...later: unknown[]) {
    const constructing = this instanceof boundFunction;
    return fn.apply(constructing ? this : context, [...bound, ...later]);
  }
  if (fn.prototype) boundFunction.prototype = Object.create(fn.prototype);
  return boundFunction;
}
