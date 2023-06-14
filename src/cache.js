import {inherits} from 'inherits-ex'
import LRUCache from './lru-cache'

const create = Object.create;
const hasOwnProperty = Object.prototype.hasOwnProperty;

export function Cache(options) {
  if (!(this instanceof Cache)) {
    return new Cache(options);
  }
  this.reset(options);
}

inherits(Cache, LRUCache);

Cache.prototype.hasFixed = function hasFixed(id) {
  return hasOwnProperty.call(this._cache, id);
};

Cache.prototype.hasLRU = LRUCache.prototype.has;

Cache.prototype.has = function(id) {
  return hasOwnProperty.call(this._cache, id) || this.hasLRU(id);
};

Cache.prototype.isExist = Cache.prototype.has;

Cache.prototype.isExists = Cache.prototype.has;

Cache.prototype.deleteLRU = LRUCache.prototype.del;

Cache.prototype.delLRU = LRUCache.prototype.del;

Cache.prototype.delFixed = function(id) {
  const result = this._cache[id];
  if (result !== undefined) {
    delete this._cache[id];
    this.fixedCapacity--;
    this.emit('del', id, result);
    return true;
  }
};

Cache.prototype.deleteFixed = Cache.prototype.delFixed;

Cache.delete = function(id) {
  let result = this.delFixed(id);
  if (!result) {
    result = this.delLRU(id);
  }
  return result;
};

Cache.prototype.del = Cache.delete;

Cache.prototype.peekLRU = LRUCache.prototype.peek;

Cache.prototype.peek = function(id) {
  let result = this._cache[id];
  if (result === undefined) {
    result = this.peekLRU(id);
  }
  return result;
};

Cache.prototype.getLRU = LRUCache.prototype.get;

Cache.prototype.getFixed = function(id) {
  return this._cache[id];
};

Cache.prototype.get = function(id) {
  let result = this._cache[id];
  if (result === undefined) {
    result = this.getLRU(id);
  }
  return result;
};

Cache.prototype.setFixed = function(id, value) {
  let event;
  const oldValue = this._cache[id];
  if (oldValue !== undefined) {
    event = 'update';
  } else {
    if (this.maxFixedCapacity > 0 && this.fixedCapacity >= this.maxFixedCapacity) {
      throw new Error('max capacity exceed on the fixed cache.');
    }
    this.fixedCapacity++;
    event = 'add';
  }
  this._cache[id] = value;
  return this.emit(event, id, value, oldValue);
};

Cache.prototype.setLRU = LRUCache.prototype.set;

Cache.prototype.set = function(id, value, options) {
  let expires;
  if (options) {
    if (options.fixed === true) {
      return this.setFixed(id, value);
    }
    expires = options > 0 ? options : options.expires;
    if (expires > 0) {
      delete this._cache[id];
    }
  }
  if (expires > 0 || !hasOwnProperty.call(this._cache, id)) {
    return this.setLRU(id, value, expires);
  } else {
    return this.setFixed(id, value);
  }
};

Cache.prototype.clearFixed = function() {
  const oldCache = this._cache;
  this._cache = create(null);
  this.fixedCapacity = 0;
  const results = [];
  for (const k in oldCache) {
    const v = oldCache[k];
    results.push(this.emit('del', k, v));
  }
  return results;
};

Cache.prototype.clearLRU = LRUCache.prototype.clear;

Cache.prototype.clear = function() {
  this.clearFixed();
  this.clearLRU();
  return this;
};

Cache.prototype.clean = Cache.prototype.clear;

Cache.prototype.resetLRU = LRUCache.prototype.reset;

Cache.prototype.reset = function(options) {
  if (options > 0) {
    this.maxFixedCapacity = 0;
  } else if (options) {
    this.maxFixedCapacity = options.fixedCapacity;
  }
  this.resetLRU(options);
  return this.clear();
};

Cache.prototype.freeLRU = LRUCache.prototype.free;

Cache.prototype.free = function() {
  const ref = this._cache;
  for (const k in ref) {
    const v = ref[k];
    this.emit('del', k, v);
  }
  this._cache = null;
  return this.freeLRU();
};

Cache.prototype.forEach = function(callback, thisArg) {
  this.forEachFixed(callback, thisArg);
  this.forEachLRU(callback, thisArg);
};

Cache.prototype.forEachFixed = function(callback, thisArg) {
  const ref = this._cache;
  for (const k in ref) {
    const v = ref[k];
    callback.call(thisArg, v, k, this);
  }
};

Cache.prototype.forEachLRU = LRUCache.prototype.forEach;

export default Cache
