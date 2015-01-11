# Secondary Cache [![Build Status](https://img.shields.io/travis/snowyu/node-secondary-cache/master.svg)](http://travis-ci.org/snowyu/node-secondary-cache) [![npm](https://img.shields.io/npm/v/secondary-cache.svg)](https://npmjs.org/package/secondary-cache) [![downloads](https://img.shields.io/npm/dm/secondary-cache.svg)](https://npmjs.org/package/secondary-cache) [![license](https://img.shields.io/npm/l/secondary-cache.svg)](https://npmjs.org/package/secondary-cache) 


It can support secondary cache mechanism. the first level cache is fixed memory-resident always with the highest priority.
the second level is the LRU cache.

the secondary LRU cache only available set the capacity of options or the key's expires time.

* Cache(options|capacity):
  * options object
    * fixedCapacity: the first fixed cache max capacity size, defaults to unlimit.
    * capacity: the second LRU cache max capacity size, defaults to unlimit. 
      deletes the least-recently-used items if reached the capacity. 
      capacity > 0 to enable the secondary LRU cache.
    * expires: the default expires time (milliscond), defaults to no expires time(<=0).
      it will be put into LRU Cache if has expires time
  * events:
    * `'expired'`: triggle on a key is expired.


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

the key whether exists in the cache.

### cache.del(key)
### cache.delete(key)

Deletes a key out of the cache.

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
### cache.clean()

Clear the cache entirely.

### cache.free()

free the first fixed cache and the secondary LRU cache.



