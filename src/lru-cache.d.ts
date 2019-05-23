export interface ILRUCacheOptions {
  /**
   * the second LRU cache max capacity size, defaults to unlimit.
   */
  capacity?: number;
  /**
   * the default expires time (milliscond), defaults to no expires time(<=0).
   */
  expires?: number;
  /**
   * clean up expired item with a specified interval(seconds) in the background.
   */
  cleanInterval?: number;
}

type LRUCacheOptions = ILRUCacheOptions|number;

export interface LRUCacheItem {
  id?: any;
  value?: any;
  expires?: number;
}

export class LRUCache {
  constructor(options?: LRUCacheOptions);
  delListener(type: string, listener: Function): LRUCache;
  on(type: string, listener: Function): LRUCache;
  off(type: string, listener: Function): LRUCache;
  has(id): boolean;
  isExist(id): boolean;
  isExists(id): boolean;
  delete(id, isInternal?: boolean): boolean;
  del(id, isInternal?: boolean): boolean;
  isExpired(item: LRUCacheItem): boolean;
  peek(id): any;
  get(id): any;
  set(id, value, expires?: number);
  clear(): LRUCache;
  reset(options?: LRUCacheOptions): LRUCache;
  free();
  forEach(callback: (item: LRUCacheItem, thisArg: any)=>void, thisArg?: any): void;
  clearExpires();
}

export default LRUCache;

