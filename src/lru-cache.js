import {eventable} from 'events-ex'
import LruQueue from './lru-queue'

const create = Object.create;
const MAX_CAPACITY = 1024;

function LRUCacheItem(id, value, expires) {
  this.id = id;
  this.value = value;
  this.expires = expires;
}

export function LRUCache(options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options);
  }
  this.reset(options);
}
// add the event support to the LRUCache Class
eventable(LRUCache);

LRUCache.prototype.delListener = LRUCache.prototype.off;

LRUCache.prototype.has = function(id) {
  const item = this._cacheLRU[id];
  return item !== undefined && !this.isExpired(item);
};

LRUCache.prototype.isExist = LRUCache.prototype.has;

LRUCache.prototype.isExists = LRUCache.prototype.has;

LRUCache.prototype.delete = function(id, isInternal) {
  if (this.cleanInterval > 0 && Date.now() - this.lastCleanTime >= this.cleanInterval) {
    setImmediate(this.clearExpires);
  }
  const result = this._cacheLRU[id];
  if (result !== undefined) {
    delete this._cacheLRU[id];
    if (this._lruQueue && isInternal !== true) {
      this._lruQueue.delete(result);
    }
    this.emit('del', id, result.value);
    return true;
  } else {
    return false;
  }
};

LRUCache.prototype.del = LRUCache.prototype.delete;

LRUCache.prototype.isExpired = function(item) {
  let expired = item.expires;
  expired = expired > 0 && Date.now() >= expired;
  if (this.cleanInterval > 0 && Date.now() - this.lastCleanTime >= this.cleanInterval) {
    setImmediate(this.clearExpires);
  } else if (expired) {
    this.del(item.id);
  }
  return expired;
};

LRUCache.prototype.peek = function(id) {
  const result = this._cacheLRU[id];
  if (result === undefined || this.isExpired(result)) {
    return;
  }
  return result.value;
};

LRUCache.prototype.get = function(id) {
  let result = this._cacheLRU[id];
  if (result !== undefined && !this.isExpired(result)) {
    if (this._lruQueue) {
      this._lruQueue.use(result);
    }
    result = result.value;
  } else {
    result = undefined;
  }
  return result;
};

LRUCache.prototype.set = function(id, value, expires) {
  let event, oldValue;
  if (this.cleanInterval > 0 && Date.now() - this.lastCleanTime >= this.cleanInterval) {
    setImmediate(this.clearExpires);
  }
  let item = this._cacheLRU[id];
  if (item !== undefined) {
    oldValue = item.value;
    item.value = value;
    if (expires <= 0) {
      delete item.expires;
    } else if (expires > 0) {
      item.expires = Date.now() + expires;
    } else if (this.maxAge > 0) {
      item.expires = Date.now() + this.maxAge;
    }
    event = 'update';
    if (this._lruQueue) {
      this._lruQueue.use(item);
    }
  } else {
    event = 'add';
    if (expires > 0) {
      expires = Date.now() + expires;
    } else if (this.maxAge > 0) {
      expires = Date.now() + this.maxAge;
    } else {
      expires = undefined;
    }
    this.emit('before_' + event, id, value, oldValue);
    item = new LRUCacheItem(id, value, expires);
    this._cacheLRU[id] = item;
    if (this._lruQueue) {
      const delItem = this._lruQueue.add(item);
      if (delItem !== undefined) {
        this.del(delItem.id, true);
      }
    }
  }
  return this.emit(event, id, value, oldValue);
};

LRUCache.prototype.clear = function() {
  const oldCache = this._cacheLRU;
  this._cacheLRU = create(null);
  for (const k in oldCache) {
    const v = oldCache[k];
    this.emit('del', k, v.value);
  }
  if (this.maxCapacity > 0) {
    this._lruQueue = new LruQueue(this.maxCapacity);
  } else {
    this._lruQueue = null;
  }
  return this;
};

LRUCache.prototype.reset = function(options) {
  this.setDefaultOptions(options);
  return this.clear();
};

LRUCache.prototype.free = function() {
  const ref = this._cacheLRU;
  for (const k in ref) {
    const v = ref[k];
    this.emit('del', k, v.value);
  }
  this._cacheLRU = null;
  this._lruQueue = null;
  return this.lastCleanTime = 0;
};

LRUCache.prototype.forEach = function(callback, thisArg) {
  if (this.cleanInterval > 0 && Date.now() - this.lastCleanTime >= this.cleanInterval) {
    setImmediate(this.clearExpires);
  }
  thisArg || (thisArg = this);
  if (this._lruQueue) {
    this._lruQueue.forEach(function(item) {
      if (!this.isExpired(item)) {
        return callback.call(thisArg, item.value, item.id, this);
      }
    }, this);
  } else {
    const ref = this._cacheLRU;
    for (const k in ref) {
      const item = ref[k];
      if (!this.isExpired(item)) {
        callback.call(thisArg, item.value, k, this);
      }
    }
  }
};

LRUCache.prototype.clearExpires = function() {
  const ref = this._cacheLRU;
  for (const k in ref) {
    const v = ref[k];
    const expires = v.expires;
    if ((v && Date.now() >= expires) || v.value === undefined) {
      this.del(k);
    }
  }
  return this.lastCleanTime = Date.now();
};

LRUCache.prototype.setDefaultOptions = function(options) {
  if (options >= 0 || options < 0) {
    this.maxCapacity = options;
    this.maxAge = 0;
    this.cleanInterval = 0;
  } else if (options) {
    this.maxCapacity = options.capacity || MAX_CAPACITY;
    this.maxAge = options.expires;
    this.cleanInterval = options.cleanInterval;
    if (this.cleanInterval > 0) {
      this.cleanInterval = this.cleanInterval * 1000;
    }
  } else {
    this.maxCapacity = MAX_CAPACITY;
  }

  if (this._lruQueue && this._lruQueue.maxCapacity !== this.maxCapacity) {
    this._lruQueue.maxCapacity = this.maxCapacity;
  }
};

LRUCache.prototype.length = function() {
  return Object.keys(this._cacheLRU).length;
};

export default LRUCache;
