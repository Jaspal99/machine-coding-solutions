type Listener<T = unknown> = (payload: T) => void;
export class EventEmitter {
  private events = new Map<string, Set<Listener>>();
  on<T>(event: string, listener: Listener<T>) {
    const set = this.events.get(event) ?? new Set();
    set.add(listener as Listener);
    this.events.set(event, set);
    return () => this.off(event, listener);
  }
  off<T>(event: string, listener: Listener<T>) {
    this.events.get(event)?.delete(listener as Listener);
  }
  emit<T>(event: string, payload: T) {
    this.events.get(event)?.forEach((listener) => listener(payload));
  }
  once<T>(event: string, listener: Listener<T>) {
    const wrapped: Listener<T> = (value) => {
      this.off(event, wrapped);
      listener(value);
    };
    return this.on(event, wrapped);
  }
}
