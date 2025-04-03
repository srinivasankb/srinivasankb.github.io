// Simple in-memory cache service
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get item from cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if not found/expired
   */
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const cachedItem = this.cache.get(key);
    const now = Date.now();

    if (now > cachedItem.expiry) {
      // Item has expired
      this.cache.delete(key);
      return null;
    }

    return cachedItem.value;
  }

  /**
   * Set item in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} [ttl] - Time to live in milliseconds
   */
  set(key, value, ttl = DEFAULT_TTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Delete item from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all items from cache
   */
  clear() {
    this.cache.clear();
  }
}

// Singleton instance
const cacheService = new CacheService();

module.exports = cacheService;
