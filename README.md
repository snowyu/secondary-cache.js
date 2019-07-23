## Secondary Cache [![Build Status](https://img.shields.io/travis/snowyu/secondary-cache.js/master.svg)](http://travis-ci.org/snowyu/secondary-cache.js) [![npm](https://img.shields.io/npm/v/secondary-cache.svg)](https://npmjs.org/package/secondary-cache) [![downloads](https://img.shields.io/npm/dm/secondary-cache.svg)](https://npmjs.org/package/secondary-cache) [![license](https://img.shields.io/npm/l/secondary-cache.svg)](https://npmjs.org/package/secondary-cache)


It can support secondary cache mechanism. the first level cache is fixed memory-resident always with the highest priority.
the second level is the LRU cache.

the secondary LRU cache only available set the capacity of options or the key's expires time.

* Cache(options|capacity):
  * options object
    * fixedCapacity: the first fixed cache max capacity size, defaults to unlimit.
    * capacity: the second LRU cache max capacity size, defaults to 1024.
      deletes the least-recently-used items if reached the capacity.
      capacity > 0 to enable the secondary LRU cache.
    * expires: the default expires time (milliscond), defaults to no expires time(<=0).
      it will be put into LRU Cache if has expires time
    * cleanInterval: clean up expired item with a specified interval(seconds) in the background.
      disable clean in the background if it's value is less than or equal 0.
  * events:
    * `'add'`: triggle on a new key added to cache.
    * `'update'`:triggle on a key updated to cache.
    * `'del'`: triggle on a key removed from cache.

* LRUCache(options|capacity): the LRU cache Class with expires supports.
  * options object
    * capacity: the LRU cache max capacity size, defaults to 1024.
      deletes the least-recently-used items if reached the capacity.
      capacity > 0 to enable the LRU.
    * expires: the default expires time (milliscond), defaults to no expires time(<=0).
      it will be put into LRU Cache if has expires time
    * cleanInterval: clean up expired item with a specified interval(seconds) in the background.
      disable clean in the background if it's value is less than or equal 0.
  * events:
    * `'add'`: triggle on a new key added to cache.
    * `'update'`:triggle on a key updated to cache.
    * `'del'`: triggle on a key removed from cache.

* LRUQueue(capacity): the LRU queue class for object queue item.
  * add(id): add the id object to the queue.
  * use(id): make the id object in the queue as most recently used items first.
  * del(id): del the id object from the queue.
  * note: it used the `'lu'` property of the object queue item.

## usage

```js
Cache = require('secondary-cache')

cache = Cache()
cache.set('key', 'value', {fixed:true})
cache.get('key')

cache.set('expireskey', 'value', 1000) //expired after 1 second

//or only use LRU Cache
LRUCache = require('secondary-cache/lib/lru-cache')
cache = LRUCache(1000)
...
```

### cache.set(key, value[,options|expires])

add/update key, value to cache.

* options:
  * fixed *(bool)*: set to first level fixed cache if true, defaults to false.
  * expires *(int)*: expires time milliscond. defaults to never expired.

It will update the "recently used"-ness of the key if LRUCache enabled.

### cache.setFixed(key, value)

add/update key,value to the first level fixed cache directly.

### cache.setLRU(key, value[,expires])

add/update key,value to the secondary level LRU cache directly.

### cache.get(key)

get the key from cache. it will fetch the key from the first fixed cache,
fetch the key from the secondary cache if missing in the first cache.

It will update the "recently used"-ness of the key in the secondary cache if LRUCache enabled.

### cache.getFixed(key)

get the key from the first level fixed cache directly.

### cache.getLRU(key)

get the key from the secondary level LRU cache directly.

### cache.peek(id)

get the key from cache. it will fetch the key from the first fixed cache,
fetch the key from the secondary cache if missing in the first cache.

It will not update the "recently used"-ness in the secondary cache.

### cache.peekLRU(id)

get the key from the secondary LRU cache directly.

It will not update the "recently used"-ness in the secondary cache.

### cache.has(key)

aliases: isExist, isExists

the key whether exists in the cache.

### cache.forEach(callback[, thisArg])

executes a provided function once per each value in the cache.
first iterated the fixed cache , and then the LRU cache.

* callback: Function to execute for each element. callback is invoked with three arguments:
  * the element value
  * the element key
  * the cache object
* thisArg: Value to use as this when executing callback.

### cache.forEachFixed(callback[, thisArg])

executes a provided function once per each value in the first level fixed cache, in insertion order.

### cache.forEachLRU(callback[, thisArg])

executes a provided function once per each value in the secondary level LRU cache,
in order of recent-ness (more recently used items are iterated over first) if LRU is enabled.
Or in insertion order.

### cache.del(key)

alias: delete

Deletes a key out of the cache.

### cache.delLRU(key)

### cache.delFixed(key)


### cache.reset(options|capacity)

Clear the cache entirely and apply the new options.

* options object
  * fixedCapacity: the first fixed cache max capacity size, defaults to unlimit.
  * capacity: the second LRU cache max capacity size, defaults to unlimit.
    deletes the least-recently-used items if reached the capacity.
    capacity > 0 to enable the secondary LRU cache.
  * expires: the default expires time (seconds), defaults to no expires time(<=0).
    it will be put into LRU Cache if has expires time

### cache.clear()

Clear the cache entirely.

### cache.on(event, listener)

Adds a listener for the specified event.

* event
  * `'add'`: triggle on a new key added to cache.
  * `'update'`:triggle on a key updated to cache.
  * `'del'`: triggle on a key removed from cache.

### cache.free()

free the first fixed cache and the secondary LRU cache.

