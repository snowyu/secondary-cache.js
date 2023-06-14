import { ILRUCacheOptions, LRUCache } from './lru-cache';

export interface ICacheOptions extends ILRUCacheOptions {
  /**
   * the fixed cache max capacity size, defaults to unlimit.
   */
  fixedCapacity?: number;
}

export interface ICacheSetOptions {
  /**
   * whether store into fixed capacity storage.
   */
  fixed?: boolean;
  /**
   * the cache item expires time(milliseconds)
   */
  expires?: number;
}

/**
 * A cache class that extends the LRU cache and allows for fixed capacity storage.
 * @param {object} options - Options for configuring the cache.
 * @param {number} [options.max] - The maximum number of items to store in the LRU cache.
 * @param {number} [options.maxAge] - The maximum age of items to store in the LRU cache (in milliseconds).
 * @param {number} [options.stale] - The maximum stale time of items to store in the LRU cache (in milliseconds).
 * @param {number} [options.fixedCapacity] - The maximum number of items to store in the fixed capacity cache.
 * @example
 * const cache = new Cache({ max: 100, maxAge: 60000, fixedCapacity: 50 });
 */
export class Cache extends LRUCache {
  fixedCapacity: number;
  maxFixedCapacity: number;

  /**
   * A cache class that extends the LRU cache and allows for fixed capacity storage.
   * @param options - optional Options object for configuring the cache or the max fixed capacity.
   * @param {number} [options.capacity=1024] - The maximum number of items that can be stored in the cache.
   * @param {number} [options.expires=0] - The default expiration time for items added to the cache, in milliseconds. A value of 0 means no expiration time.
   * @param {number} [options.cleanInterval=0] - The interval time for automatically cleaning up expired items from the cache, in seconds. A value of 0 means no automatic cleaning.
   * @param {number} [options.fixedCapacity] - The maximum number of items to store in the fixed capacity cache.
   * @example
   * const cache = new Cache({ max: 100, expires: 60000, fixedCapacity: 50 });
   */
  constructor(options?: ICacheOptions|number);

  /**
   * Checks whether an item exists in the fixed capacity cache.
   * @param {string} id - The identifier of the item to check.
   * @returns {boolean} - True if the item exists in the fixed capacity cache, false otherwise.
   * @example
   * const exists = cache.hasFixed("someItem");
   */
  hasFixed(id): boolean;
  hasLRU(id): boolean;
  deleteLRU(id, isInternal?: boolean): boolean;
  delLRU(id, isInternal?: boolean): boolean;
  /**
   * Removes an item from the fixed capacity cache.
   * @param {string} id - The identifier of the item to remove.
   * @returns {boolean} - True if the item was removed successfully, false otherwise.
   * @example
   * const removed = cache.deleteFixed("someItem");
   */
  deleteFixed(id): boolean;
  /**
   * Alias of deleteFixed
   * @param {string} id - The identifier of the item to remove.
   * @returns {boolean} - True if the item was removed successfully, false otherwise.
   * @example
   * const removed = cache.delFixed("someItem");
   */
  delFixed(id): boolean;

  /**
   * Removes an item from the cache.
   * @param {string} id - The identifier of the item to remove.
   * @returns {boolean} - True if the item was removed successfully, false otherwise.
   * @example
   * const removed = cache.delete("someItem");
   */
  delete(id): boolean;
  del(id): boolean;

  /**
   * Retrieves the value of an item from the fixed capacity cache.
   * @param {string} id - The identifier of the item to retrieve.
   * @returns {*} - The value of the item in the fixed capacity cache.
   * @example
   * const value = cache.getFixed("someItem");
   */
  getFixed(id): any;
  getLRU(id): any;
  peekLRU(id): any;

  /**
   * Adds or updates an item in the fixed capacity cache.
   * @param {string} id - The identifier of the item to add or update.
   * @param {*} value - The value of the item to add or update.
   * @returns {boolean} - True if the item was added or updated successfully, false otherwise.
   * @example
   * const added = cache.setFixed("someItem", "someValue");
   */
  setFixed(id, value);
  setLRU(id, value, expires?: number);

  /**
   * Adds or updates an item in the cache.
   * @param {string} id - The identifier of the item to add or update.
   * @param {*} value - The value of the item to add or update.
   * @param {object} [options] - Options for configuring the item in the cache.
   * @param {boolean} [options.fixed=false] - Whether to store the item in the fixed capacity cache instead of the LRU cache.
   * @param {number} [options.expires=0] - The expiration time of the item (in milliseconds).
   * @returns {boolean} - True if the item was added or updated successfully, false otherwise.
   * @example
   * const added = cache.set("someItem", "someValue", { fixed: true });
   */
  set(id, value, options?: ICacheSetOptions|number);

  /**
   * Frees up the LRU memory used by the cache.
   * @example
   * cache.freeLRU();
   */
  freeLRU();
  forEachFixed(callback: (value: any, id: any, thisArg: any)=>void, thisArg?: any): void;
  reset(options?: ICacheOptions|number): Cache;
}

export default Cache;
