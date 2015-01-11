lruQueue        = require('lru-queue')
emitter         = require('event-emitter').methods
setImmediate    = setImmediate || process.nextTick

addListener     = emitter.on
once            = emitter.once
delListener     = emitter.off
emit            = emitter.emit
create          = Object.create
hasOwnProperty  = Object.prototype.hasOwnProperty

module.exports  = (options)->
  maxFixedCapacity = null
  fixedCapacity = 0
  cleanInterval = null
  maxCapacity   = null
  maxAge        = null
  _cache        = null
  _cacheLRU     = null
  _cacheExpired = null  # {id: expired_time}
  _lruQueue     = null
  lastCleanTime = null

  class Cache
    constructor: (options)->
      @reset(options)
    emit: emit
    on: addListener
    addListener: addListener
    off: delListener
    delListener: delListener
    hasFixed: (id)->hasOwnProperty.call(_cache, id) 
    hasLRU: hasLRU= (id)->
      result = false
      if hasOwnProperty.call(_cacheLRU, id)
        expires = _cacheExpired[id]
        if expires > 0 and Date.now() >= expires
          delLRU(id)
        else
          result = true
      result
    has: (id) ->
      hasOwnProperty.call(_cache, id) or hasLRU(id)
    deleteLRU: (id)->
      if hasOwnProperty.call(_cacheLRU, id)
        result = _cacheLRU[id]
        delete _cacheLRU[id]
        delete _cacheExpired[id]
        _lruQueue.delete(id) if _lruQueue
        cache.emit('delete', id, result)
        true
    delLRU = @::delLRU = @::deleteLRU
    delFixed: (id)->
      if hasOwnProperty.call(_cache, id)
        result = _cache[id]
        delete _cache[id]
        cache.emit('delete', id, result)
        true
    deleteFixed: @::delFixed
    delete: (id) ->
      if hasOwnProperty.call(_cache, id)
        result = _cache[id]
        delete _cache[id]
      else if hasOwnProperty.call(_cacheLRU, id)
        result = _cacheLRU[id]
        delete _cacheLRU[id]
        _lruQueue.delete(id) if _lruQueue
      else return false
      cache.emit('delete', id, result)
      true
    del: @::delete
    getFixed: (id) ->
      if hasOwnProperty.call(_cache, id)
        _cache[id]
    # peek a id from LRU Cache, without updating the "recently used"-ness of the key
    peekLRU: peekLRU = (id)->
      if hasOwnProperty.call(_cacheLRU, id)
        expires = _cacheExpired[id]
        if expires > 0 and Date.now() >= expires
          delLRU(id)
        else
          result = _cacheLRU[id]
      result
    peek: (id)->
      if hasOwnProperty.call(_cache, id)
        _cache[id]
      else
        peekLRU(id)
    getLRU: getLRU = (id)->
      if hasOwnProperty.call(_cacheLRU, id)
        expires = _cacheExpired[id]
        if expires > 0 and Date.now() >= expires
          delLRU(id)
        else
          result = _cacheLRU[id]
          if _lruQueue
            delId = _lruQueue.hit(id)
            delLRU(delId) if delId isnt undefined
      result
    getFixed: (id)->
      if hasOwnProperty.call(_cache, id)
        _cache[id]
    get: (id)->
      if hasOwnProperty.call(_cache, id)
        _cache[id]
      else
        getLRU(id)
    setFixed: setFixed = (id, value)->
      if hasOwnProperty.call(_cache, id)
        oldValue = _cache[id]
        event = 'update'
      else
        throw new Error('max capacity exceed.') if maxFixedCapacity > 0 and fixedCapacity >= maxFixedCapacity
        event = 'add'
      _cache[id] = value
      cache.emit(event, id, value, oldValue)
    setLRU: setLRU = (id, value, expires)->
      if hasOwnProperty.call(_cacheLRU, id)
        oldValue = _cacheLRU[id]
        if expires <= 0
          delete _cacheExpired[id]
        else if expires > 0 # skip illegal expires
          _cacheExpired[id] = Date.now() + expires
        event = 'update'
      else
        event = 'add'
        if expires > 0
          _cacheExpired[id] = Date.now() + expires
      if _lruQueue
        delId = _lruQueue.hit(id)
        delLRU(delId) if delId isnt undefined
      _cacheLRU[id] = value
      cache.emit(event, id, value, oldValue)
    set: (id, value, options)->
      if options
        return setFixed id, value if options.fixed is true
        expires = if options > 0 then options else options.expires
        delete _cache[id] if expires > 0
      setLRU id, value, expires
    clear: ->
      oldCache      = _cache
      _cache        = create(null)
      fixedCapacity = 0
      for k,v of oldCache
        cache.emit('delete', k, v)
      oldCache      = _cacheLRU
      _cacheLRU     = create(null)
      for k,v of oldCache
        cache.emit('delete', k, v)
      oldCache      = _cacheExpired
      _cacheExpired = create(null)
      if maxCapacity > 0
        _lruQueue   = lruQueue(maxCapacity)
      else
        _lruQueue   = null
      return @
    clean: @::clear
    reset: (options)->
      if options > 0
        maxCapacity   = options
        maxAge        = null
        maxFixedCapacity = null
        cleanInterval = null
      else if options
        maxCapacity   = options.capacity
        maxAge        = options.expires
        maxFixedCapacity = options.fixedCapacity
        cleanInterval = options.cleanInterval
      @clear()
    free: ()->
      for k,v of _cache
        cache.emit('delete', k, v)
      for k,v of _cacheLRU
        cache.emit('delete', k, v)
      _cache        = null
      _cacheLRU     = null
      _cacheExpired = null
      _lruQueue     = null
      lastCleanTime = null
    #executes a provided function once per each value in the cache object, in insertion order.
    # callback: Function to execute for each element. callback is invoked with three arguments:
    #   * the element value
    #   * the element key
    #   * the cache object
    # thisArg: Value to use as this when executing callback.
    forEach: (callback, thisArg)->
      for k,v of _cache
        callback.call thisArg, v, k, cache
      for k,v of _cacheLRU
        callback.call thisArg, v, k, cache
      return
    forEachFixed: (callback, thisArg)->
      for k,v of _cache
        callback.call thisArg, v, k, cache
      return
    forEachLRU: (callback, thisArg)->
      for k,v of _cacheLRU
        callback.call thisArg, v, k, cache
      return
    clearExpires: ->
      for k,v of _cacheExpired
        delLRU(k) if Date.now() >= _cacheExpired[k]

  cache = new Cache(options)