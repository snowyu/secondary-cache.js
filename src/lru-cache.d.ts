import {LRUQueue} from './lru-queue';

export interface ILRUCacheOptions {
  /**
   * the second LRU cache max capacity size, defaults to unlimited.
   */
  capacity?: number;
  /**
   * the default expires time (millisecond), defaults to no expires time(<=0).
   */
  expires?: number;
  /**
   * clean up expired item with a specified interval(seconds) in the background.
   */
  cleanInterval?: number;
}

export interface LRUCacheItem {
  id?: any;
  value?: any;
  expires?: number;
}

/**
 *   Least Recently Used (LRU) Cache.
 *   @example
 *   const cache = new LRUCache({
 *     capacity: 100,
 *     expires: 30000, // 30 seconds
 *     cleanInterval: 60 // 1 minute
 *   });
 *   cache.set('key1', 'value1', 5000); // add an item with expiration time of 5 seconds
 *   cache.set('key2', 'value2'); // add an item with default expiration time
 *   cache.get('key1'); // returns 'value1'
 *   cache.forEach((value, key, cache) => console.log(key, value)); // iterates over each item in the cache
 *   cache.delete('key1'); // removes the item with key 'key1'
 *   cache.clear(); // removes all items from the cache
 *   cache.free(); // frees up the memory used by the cache
 */
export class LRUCache {
  maxCapacity: number;
  maxAge: number;
  cleanInterval: number;

  _cacheLRU: Object
  _lruQueue: LRUQueue

  /**
   *   Represents a Least Recently Used (LRU) Cache.
   *   @constructor
   *   @param [options] - Optional the configuration options object for the cache or the max capacity number.
   *   @param {number} [options.capacity=1024] - The maximum number of items that can be stored in the cache.
   *   @param {number} [options.expires=0] - The default expiration time for items added to the cache, in milliseconds. A value of 0 means no expiration time.
   *   @param {number} [options.cleanInterval=0] - The interval time for automatically cleaning up expired items from the cache, in seconds. A value of 0 means no automatic cleaning.
   *   @example
   *   const cache = new LRUCache({
   *     capacity: 100,
   *     expires: 30000, // 30 seconds
   *     cleanInterval: 60 // 1 minute
   *   });
   *   cache.set('key1', 'value1', 5000); // add an item with expiration time of 5 seconds
   *   cache.set('key2', 'value2'); // add an item with default expiration time
   *   cache.get('key1'); // returns 'value1'
   *   cache.forEach((value, key, cache) => console.log(key, value)); // iterates over each item in the cache
   *   cache.delete('key1'); // removes the item with key 'key1'
   *   cache.clear(); // removes all items from the cache
   *   cache.free(); // frees up the memory used by the cache
   */
  constructor(options?: ILRUCacheOptions|number);
  delListener(type: string, listener: Function): LRUCache;
  on(type: string, listener: Function): LRUCache;
  off(type: string, listener: Function): LRUCache;
  /**
   * Checks whether an item exists in the cache.
   * @param id the id to check
   * @returns {boolean} - True if the item exists in the cache, false otherwise.
   * @example
   * const exists = cache.has("someItem");
   */
  has(id: any): boolean;
  /**
   * Wether the id is in the cache
   * @param id the id to check
   */
  isExist(id: any): boolean;
  /**
   * Wether the id is in the cache
   * @param id the id to check
   */
  isExists(id: any): boolean;

  /**
   *   Deletes an item from the cache.
   *   @param id - The key of the item to delete.
   *   @param {boolean} [isInternal=false] - Indicates whether the function is called internally.
   *   @returns {boolean} - Returns `true` if the item was deleted, or `false` if the item was not found in the cache.
   *   @example
   *   cache.delete('key1'); // removes the item with key 'key1'
   */
  delete(id: any, isInternal?: boolean): boolean;

  /**
   *   Alias for `delete()`.
   *   @param id - The key of the item to delete.
   *   @param {boolean} [isInternal=false] - Indicates whether the function is called internally.
   *   @returns {boolean} - Returns `true` if the item was deleted, or `false` if the item was not found in the cache.
   *   @example
   *   cache.del('key1'); // removes the item with key 'key1'
   */
  del(id: any, isInternal?: boolean): boolean;

  /**
   * Check the item whether already expired, the item will be removed from the cache if expired
   * @param item the item to check
   */
  isExpired(item: LRUCacheItem): boolean;

  /**
   *   Returns the value of an item in the cache without updating its last-used time.
   *   @param id - The key of the item to retrieve.
   *   @returns {*} - Returns the value of the item, or `undefined` if the item was not found in the cache or has expired.
   *   @example
   *   const value = cache.peek('key1');
   */
  peek(id: any): any;

  /**
   *   Returns the value of an item in the cache and updates its last-used time.
   *   @param id - The key of the item to retrieve.
   *   @returns {*} - Returns the value of the item, or `undefined` if the item was not found in the cache or has expired.
   *   @example
   *   const value = cache.get('key1');
   */
  get(id: any): any;

  /**
   *   Adds or updates an item in the cache.
   *   @param id - The key of the item to add or update.
   *   @param value - The value of the item.
   *   @param {number} [expires] - The expiration time for the item, in milliseconds. A value of 0 means no expiration  time.
   *   @returns {*} - Returns the new value of the item, or `undefined` if the item was not found in the cache or has  expired.
   *   @example
   *   cache.set('key1', 'value1', 5000); // add an item with expiration time of 5 seconds
   *   cache.set('key2', 'value2'); // add an item with default expiration time
   */
  set(id: any, value: any, expires?: number);

  /**
   *   Deletes all items from the cache.
   *   @returns {LRUCache} - Returns the cache instance.
   *   @example
   *   cache.clear(); // removes all items from the cache
   */
  clear(): LRUCache;
  reset(options?: ILRUCacheOptions|number): LRUCache;

  /**
   *   Frees up the memory used by the cache.
   *   @returns {number} - Returns the timestamp of the last cleanup operation.
   *   @example
   *   cache.free(); // frees up the memory used by the cache
   */
  free();

  /**
   *   Iterates over each item in the cache and calls a function for each item.
   *   @param {Function} callback - The function to call for each item. The function should accept three arguments: `value`, `id`, and `this`.
   *   @param {*} [thisArg=this] - The `this` value to use when calling the function.
   *   @example
   *   cache.forEach((value, key, cache) => console.log(key, value));
   */
  forEach(callback: (value: any, id: any, thisArg: any)=>void, thisArg?: any): void;

  /**
   *   Deletes all expires items from the cache.
   *   @returns {LRUCache} - Returns the cache instance.
   *   @example
   *   cache.clearExpires(); // removes all expires items from the cache
   */
  clearExpires();

  /**
   * Sets the default options for LRUCache.
   * @param options - The options for LRUCache, which can be of type ILRUCacheOptions or number.
   *                  If the options is a number, it represents the maxCapacity of the cache
   */
  setDefaultOptions(options?: ILRUCacheOptions|number);
}

export default LRUCache;

