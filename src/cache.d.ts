import { ILRUCacheOptions, LRUCache } from './lru-cache';

export interface ICacheOptions extends ILRUCacheOptions {
  fixedCapacity?: number;
}

export interface ICacheSetOptions {
  fixed?: boolean;
  expires?: number;
}

export class Cache extends LRUCache {
  hasFixed(id): boolean;
  hasLRU(id): boolean;
  deleteLRU(id, isInternal?: boolean): boolean;
  delLRU(id, isInternal?: boolean): boolean;
  delete(id): boolean;
  del(id): boolean;
  getFixed(id): any;
  getLRU(id): any;
  peekLRU(id): any;
  setFixed(id, value);
  setLRU(id, value, expires?: number);
  set(id, value, options?: ICacheSetOptions|number);
  freeLRU();
  forEachFixed(callback: (item: any, thisArg: any)=>void, thisArg?: any): void;
}

export default Cache;
