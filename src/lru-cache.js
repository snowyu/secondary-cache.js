import {eventable} from 'events-ex'
import LruQueue from './lru-queue'

const create = Object.create;
const MAX_CAPACITY = 1024;

function LRUCacheItem(id, value, expires, weight) {
  this.id = id;
  this.value = value;
  this.expires = expires;
  this.weight = weight || 0;
}

export function LRUCache(options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options);
  }
  this._totalWeight = 0;
  this.reset(options);
}
// add the event support to the LRUCache Class
eventable(LRUCache);

/**
 * Calculate the weight of a value. Override this method to customize capacity calculation.
 * @param {*} value - The value to calculate weight for.
 * @param {string} id - The id of the value.
 * @returns {number} The weight of the value. Default returns 1 (count-based).
 */
LRUCache.prototype.weightOf = function(value, id) {
  // Default: return 1 (count-based, same as original behavior)
  // Override this method to implement size-based or custom capacity control
  if (this._weightOfFn) {
    return this._weightOfFn(value, id);
  }
  return 1;
};

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
    this._totalWeight -= result.weight || 0;
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
  let event;
  if (this.cleanInterval > 0 && Date.now() - this.lastCleanTime >= this.cleanInterval) {
    setImmediate(this.clearExpires);
  }
  let item = this._cacheLRU[id];
  const oldValue = item && item.value;
  if (item !== undefined) {
    event = 'update';
  } else {
    event = 'add';
  }
  this.emit('before_' + event, id, value, oldValue);
  if (item !== undefined) {
    // Update existing item
    const newWeight = this.weightOf(value, id);
    if (this.maxWeight > 0 && newWeight > this.maxWeight) {
      throw new Error('Item weight ' + newWeight + ' exceeds maxWeight ' + this.maxWeight);
    }
    this._totalWeight -= item.weight || 0;
    item.value = value;
    item.weight = newWeight;
    this._totalWeight += newWeight;
    if (expires <= 0) {
      delete item.expires;
    } else if (expires > 0) {
      item.expires = Date.now() + expires;
    } else if (this.maxAge > 0) {
      item.expires = Date.now() + this.maxAge;
    }
    if (this._lruQueue) {
      this._lruQueue.use(item);
    }
  } else {
    // Add new item
    const weight = this.weightOf(value, id);
    if (this.maxWeight > 0 && weight > this.maxWeight) {
      throw new Error('Item weight ' + weight + ' exceeds maxWeight ' + this.maxWeight);
    }
    if (expires > 0) {
      expires = Date.now() + expires;
    } else if (this.maxAge > 0) {
      expires = Date.now() + this.maxAge;
    } else {
      expires = undefined;
    }
    item = new LRUCacheItem(id, value, expires, weight);
    this._cacheLRU[id] = item;
    this._totalWeight += weight;
    if (this._lruQueue) {
      const delItem = this._lruQueue.add(item);
      if (delItem !== undefined) {
        this.del(delItem.id, true);
      }
    }
  }

  if (this._lruQueue) {
    // Check weight-based eviction (LRUQueue only handles capacity, LRUCache handles weight)
    if (this.maxWeight > 0 && this._totalWeight > this.maxWeight) {
      let popItem;
      while (this._totalWeight > this.maxWeight && this._lruQueue.length > 0) {
        popItem = this._lruQueue.pop();
        if (popItem) {
          this.del(popItem.id, true);
        } else {
          break;
        }
      }
    }
  }

  return this.emit(event, id, value, oldValue);
};

LRUCache.prototype.clear = function() {
  const oldCache = this._cacheLRU;
  this._cacheLRU = create(null);
  this._totalWeight = 0;
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
  this._totalWeight = 0;
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
    this.maxWeight = 0;
    this._weightOfFn = null;
  } else if (options) {
    this.maxCapacity = options.capacity || MAX_CAPACITY;
    this.maxAge = options.expires;
    this.cleanInterval = options.cleanInterval;
    this.maxWeight = options.maxWeight || 0;
    this._weightOfFn = options.weightOf || null;
    if (this.cleanInterval > 0) {
      this.cleanInterval = this.cleanInterval * 1000;
    }
  } else {
    this.maxCapacity = MAX_CAPACITY;
    this.maxWeight = 0;
    this._weightOfFn = null;
  }

  if (this._lruQueue) {
    if (this._lruQueue.maxCapacity !== this.maxCapacity) {
      this._lruQueue.maxCapacity = this.maxCapacity;
    }
  }
};

Object.defineProperty(LRUCache.prototype, 'totalWeight', {
  get: function() {
    return this._totalWeight;
  }
});

LRUCache.prototype.length = function() {
  return Object.keys(this._cacheLRU).length;
};

export default LRUCache;
