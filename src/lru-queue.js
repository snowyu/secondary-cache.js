const create = Object.create;

/**
 * Creates a new `QueueItem` object with the given value.
 *
 * @param {*} value - The value to store in the queue item.
 */
function QueueItem(value) {
  this.value = value;
}

/**
 * Creates a new `LRUQueue` object with the given `capacity`.
 *
 * @param {number} capacity - The maximum number of items the queue can hold.
 * @returns {LRUQueue} The new `LRUQueue` object.
 */
export function LRUQueue(capacity) {
  if (!(this instanceof LRUQueue)) {
    return new LRUQueue(capacity);
  }
  this.maxCapacity = capacity > 0 ? capacity : 0;
  this.clear();
}

LRUQueue.prototype.add = function(id) {
  let result;
  /*
`id.lu` is used as a property of the id object to store the index of the item in the queue. Specifically, it is used to keep track of the position of the item in the queue, so that it can be efficiently moved to the most recently used position or removed from the queue when necessary.

The lu property is short for "last used", and it is used to implement the least-recently-used (LRU) caching mechanism, where the item that was least recently used is removed from the cache when the cache reaches its capacity limit. By keeping track of the position of each item in the queue using the lu property, the queue can efficiently move items to the most recently used position and remove items from the least recently used position, without having to search the entire queue for each operation.

`this._mru` is used to keep track of the index of the next available position in the queue.

When a new item is added to the queue using the add() method, the id object is assigned to the current value of this._mru, and this._mru is then incremented to indicate that the next available position in the queue is one index higher. This ensures that each item in the queue has a unique index that can be used to efficiently access and manipulate the item.

Similarly, when an item is moved to the most recently used position in the queue using the use() method, the id object's lu property is updated to the current value of this._mru, and this._mru is then incremented to indicate that the next available position in the queue is one index higher.

The _mru property is short for "most recently used", and it is used to implement the LRU caching mechanism, where the item that was most recently used is moved to the front of the queue, so that it is the last item to be removed from the queue when the cache reaches its capacity limit. By keeping track of the next available position in the queue using _mru, the queue can efficiently add new items to the end of the queue and move existing items to the front of the queue without having to search the entire queue for each operation.
   */
  id.lu = this._mru;
  this.queue[this._mru] = id;
  ++this.length;
  ++this._mru;
  if (this.length > this.maxCapacity) {
    result = this.pop();
  }
  return result;
};

LRUQueue.prototype.push = LRUQueue.prototype.add;

LRUQueue.prototype.pop = function() {
  this.shiftLU();
  const result = this.queue[this._lru];
  delete this.queue[this._lru];
  --this.length;
  return result;
};

LRUQueue.prototype.use = function(id) {
  delete this.queue[id.lu];
  id.lu = this._mru;
  this.queue[this._mru] = id;
  ++this._mru;
};

LRUQueue.prototype.hit = function(id) {
  if (typeof id === 'string' || typeof id === 'number' || typeof id === 'boolean') {
    const s = id;
    if (this._map) {
      id = this._map[s];
      if (id === undefined) {
        id = new QueueItem(s);
      }
    } else {
      this._map = create(null);
      id = new QueueItem(s);
    }
    this._map[s] = id;
  }
  if (id.lu === undefined) {
    let result = this.add(id);
    if (result instanceof QueueItem) {
      result = result.value;
      delete this._map[result];
    }
    return result;
  } else {
    return this.use(id);
  }
};

LRUQueue.prototype.delete = function(id) {
  if (this.queue[id.lu]) {
    delete this.queue[id.lu];
    --this.length;
    if (this.length) {
      this.shiftLU();
    } else {
      this._mru = 0;
      this._lru = 0;
    }
  }
};

LRUQueue.prototype.del = LRUQueue.prototype.delete;

LRUQueue.prototype.forEach = function(callback, thisArg) {
  thisArg || (thisArg = this);
  let k = this._mru;
  let i = 0;
  while (--k >= 0 && i < this.length) {
    const item = this.queue[k];
    if (item) {
      ++i;
      callback.call(thisArg, item, this);
    }
  }
};

LRUQueue.prototype.clear = function() {
  this.length = 0;
  this._lru = 0;
  this._mru = 0;
  this.queue = create(null);
  delete this._map;
};

LRUQueue.prototype.shiftLU = function() {
  while (this._lru < this._mru && !this.queue[this._lru]) {
    this._lru++;
  }
};

export default LRUQueue;
