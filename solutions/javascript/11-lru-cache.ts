export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  constructor(private capacity: number) {
    if (capacity < 1) throw new Error("Capacity must be positive");
  }
  get(key: K) {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  put(key: K, value: V) {
    this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity)
      this.cache.delete(this.cache.keys().next().value!);
  }
  get size() {
    return this.cache.size;
  }
}
