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
  cleanInterval = 0
  maxCapacity   = 0
  maxAge        = 0
  _cache        = null
  _cacheLRU     = null
  _cacheExpired = null  # {id: expired_time}
  _lruQueue     = null
  lastCleanTime = 0

  class Cache
    constructor: (options)->
      @reset(options)
    emit: emit
    on: addListener
    addListener: addListener
    off: delListener
    delListener: delListener
    hasFixed: (id)->hasOwnProperty.call(_cache, id) 
    hasLRU: hasLRU= (id)->hasOwnProperty.call(_cacheLRU, id) and not isExpired(id)
    has: (id) ->hasOwnProperty.call(_cache, id) or hasLRU(id)
    deleteLRU: (id)->
      setImmediate clearExpires if cleanInterval > 0 and Date.now() - lastCleanTime >= cleanInterval
      if hasOwnProperty.call(_cacheLRU, id)
        result = _cacheLRU[id]
        delete _cacheLRU[id]
        delete _cacheExpired[id]
        _lruQueue.delete(id) if _lruQueue
        cache.emit('del', id, result)
        true
    delLRU = @::delLRU = @::deleteLRU
    delFixed: (id)->
      if hasOwnProperty.call(_cache, id)
        result = _cache[id]
        delete _cache[id]
        fixedCapacity--
        cache.emit('del', id, result)
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
      cache.emit('del', id, result)
      true
    del: @::delete
    getFixed: (id) ->
      if hasOwnProperty.call(_cache, id)
        _cache[id]
    isExpired: isExpired = (id)->
      if cleanInterval > 0 and Date.now() - lastCleanTime >= cleanInterval
        setImmediate clearExpires
      else
        expires = _cacheExpired[id]
        if expires > 0 and Date.now() >= expires
          delLRU(id)
          return true
    # peek a id from LRU Cache, without updating the "recently used"-ness of the key
    peekLRU: peekLRU = (id)->
      if hasOwnProperty.call(_cacheLRU, id) and not isExpired(id)
        _cacheLRU[id]
    peek: (id)->
      if hasOwnProperty.call(_cache, id)
        _cache[id]
      else
        peekLRU(id)
    getLRU: getLRU = (id)->
      if hasOwnProperty.call(_cacheLRU, id) and not isExpired(id)
        if _lruQueue
          delId = _lruQueue.hit(id)
          delLRU(delId) if delId isnt undefined
        result = _cacheLRU[id]
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
        throw new Error('max capacity exceed on the fixed cache.') if maxFixedCapacity > 0 and fixedCapacity >= maxFixedCapacity
        fixedCapacity++
        event = 'add'
      _cache[id] = value
      cache.emit(event, id, value, oldValue)
    setLRU: setLRU = (id, value, expires)->
      setImmediate clearExpires if cleanInterval > 0 and Date.now() - lastCleanTime >= cleanInterval
      if hasOwnProperty.call(_cacheLRU, id)
        oldValue = _cacheLRU[id]
        if expires <= 0
          delete _cacheExpired[id]
        else if expires > 0 # skip illegal expires
          _cacheExpired[id] = Date.now() + expires
        else if maxAge > 0
          _cacheExpired[id] = Date.now() + maxAge
        event = 'update'
      else
        event = 'add'
        if expires > 0
          _cacheExpired[id] = Date.now() + expires
        else if maxAge > 0
          _cacheExpired[id] = Date.now() + maxAge
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
      if expires > 0 or not hasOwnProperty.call(_cache, id)
        setLRU id, value, expires
      else
        setFixed id, value
    clearFixed: clearFixed = ->
      oldCache      = _cache
      _cache        = create(null)
      fixedCapacity = 0
      for k,v of oldCache
        cache.emit('del', k, v)
    clearLRU: clearLRU= ->
      oldCache      = _cacheLRU
      _cacheLRU     = create(null)
      _cacheExpired = create(null)
      for k,v of oldCache
        cache.emit('del', k, v)
      if maxCapacity > 0
        _lruQueue   = lruQueue(maxCapacity)
      else
        _lruQueue   = null
    clear: ->
      @clearFixed()
      @clearLRU()
      return @
    clean: @::clear
    reset: (options)->
      if options > 0
        maxCapacity   = options
        maxAge        = 0
        maxFixedCapacity = 0
        cleanInterval = 0
      else if options
        maxCapacity   = options.capacity
        maxAge        = options.expires
        maxFixedCapacity = options.fixedCapacity
        cleanInterval = options.cleanInterval
        cleanInterval = cleanInterval * 1000 if cleanInterval > 0
      @clear()
    free: ()->
      for k,v of _cache
        cache.emit('del', k, v)
      for k,v of _cacheLRU
        cache.emit('del', k, v)
      _cache        = null
      _cacheLRU     = null
      _cacheExpired = null
      _lruQueue     = null
      lastCleanTime = 0
    #executes a provided function once per each value in the cache object, in insertion order.
    # callback: Function to execute for each element. callback is invoked with three arguments:
    #   * the element value
    #   * the element key
    #   * the cache object
    # thisArg: Value to use as this when executing callback.
    forEach: (callback, thisArg)->
      forEachFixed  callback, thisArg
      forEachLRU    callback, thisArg
      return
    forEachFixed: forEachFixed=(callback, thisArg)->
      for k,v of _cache
        callback.call thisArg, v, k, cache
      return
    forEachLRU: forEachLRU=(callback, thisArg)->
      setImmediate clearExpires if cleanInterval > 0 and Date.now() - lastCleanTime >= cleanInterval
      for k,v of _cacheLRU
        callback.call thisArg, v, k, cache if not isExpired k
      return
    clearExpires: clearExpires= ->
      for k,v of _cacheExpired
        delLRU(k) if Date.now() >= _cacheExpired[k]
      lastCleanTime = Date.now()

  cache = new Cache(options)