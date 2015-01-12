util            = require('abstract-object/util')
LRUCache        = require('./lru-cache')
setImmediate    = setImmediate || process.nextTick

create          = Object.create
hasOwnProperty  = Object.prototype.hasOwnProperty
inherits        = util.inherits

module.exports  = class Cache
  inherits Cache, LRUCache

  constructor: (options)->
    if (this not instanceof Cache) then return new Cache(options)
    @reset(options)
  hasFixed: (id)->hasOwnProperty.call(@_cache, id) 
  hasLRU: LRUCache::has
  has: (id) ->hasOwnProperty.call(@_cache, id) or @hasLRU(id)
  deleteLRU: LRUCache::del
  delFixed: (id)->
    result = @_cache[id]
    if result isnt undefined
      delete @_cache[id]
      @fixedCapacity--
      @emit('del', id, result)
      true
  deleteFixed: @::delFixed
  delete: (id) ->
    result = @_cache[id]
    if result isnt undefined
      delete @_cache[id]
    else
      result = @_cacheLRU[id]
      if result isnt undefined
        delete @_cacheLRU[id]
        @_lruQueue.delete(id) if @_lruQueue
      else return false
    @emit('del', id, result.value)
    true
  del: @::delete
  getFixed: (id) ->@_cache[id]
  # peek a id from LRU Cache, without updating the "recently used"-ness of the key
  peekLRU: LRUCache::peek
  peek: (id)->
    result = @_cache[id]
    if result isnt undefined
      result
    else
      peekLRU(id)
  getLRU: LRUCache::get
  getFixed: (id)-> @_cache[id]
  get: (id)->
    result = @_cache[id]
    if result isnt undefined
      result
    else
      @getLRU(id)
  setFixed: (id, value)->
    oldValue = @_cache[id]
    if oldValue isnt undefined
      event = 'update'
    else
      throw new Error('max capacity exceed on the fixed cache.') if @maxFixedCapacity > 0 and @fixedCapacity >= @maxFixedCapacity
      @fixedCapacity++
      event = 'add'
    @_cache[id] = value
    @emit(event, id, value, oldValue)
  setLRU: LRUCache::set
  set: (id, value, options)->
    if options
      return @setFixed id, value if options.fixed is true
      expires = if options > 0 then options else options.expires
      delete @_cache[id] if expires > 0
    if expires > 0 or not hasOwnProperty.call(@_cache, id)
      @setLRU id, value, expires
    else
      @setFixed id, value
  clearFixed: ->
    oldCache      = @_cache
    @_cache        = create(null)
    @fixedCapacity = 0
    for k,v of oldCache
      @emit('del', k, v)
  clearLRU: LRUCache::clear
  clear: ->
    @clearFixed()
    @clearLRU()
    return @
  clean: @::clear
  resetLRU: LRUCache::reset
  reset: (options)->
    if options > 0
      @maxFixedCapacity = 0
    else if options
      @maxFixedCapacity = options.fixedCapacity
    @resetLRU(options)
    @clear()
  freeLRU: LRUCache::free
  free: ->
    for k,v of @_cache
      @emit('del', k, v)
    @_cache        = null
    @freeLRU
  #executes a provided function once per each value in the cache object, in insertion order.
  # callback: Function to execute for each element. callback is invoked with three arguments:
  #   * the element value
  #   * the element key
  #   * the cache object
  # thisArg: Value to use as this when executing callback.
  forEach: (callback, thisArg)->
    @forEachFixed  callback, thisArg
    @forEachLRU    callback, thisArg
    return
  forEachFixed: (callback, thisArg)->
    for k,v of @_cache
      callback.call thisArg, v, k, @
    return
  forEachLRU: LRUCache::forEach
