lruQueue        = require('./lru-queue')
emitter         = require('event-emitter').methods
setImmediate    = setImmediate || process.nextTick

addListener     = emitter.on
once            = emitter.once
delListener     = emitter.off
emit            = emitter.emit
create          = Object.create
hasOwnProperty  = Object.prototype.hasOwnProperty

module.exports  = class LRUCache
  class LRUCacheItem
    constructor: (@id, @value, @expires)->
  constructor: (options)->
    if (this not instanceof Cache) then return new LRUCache(options)
    @reset(options)
  emit: emit
  on: addListener
  addListener: @::on
  off: delListener
  delListener: @::off
  has: (id)->
    item = @_cacheLRU[id]
    item isnt undefined and not @isExpired(item)
  delete: (id)->
    setImmediate @clearExpires if @cleanInterval > 0 and Date.now() - @lastCleanTime >= @cleanInterval
    result = @_cacheLRU[id]
    if result isnt undefined
      delete @_cacheLRU[id]
      @_lruQueue.delete(result) if @_lruQueue
      @emit('del', id, result.value)
      true
    else
      false
  del: @::delete
  isExpired: (item)->
    expired = item.expires
    expired = expired > 0 and Date.now() >= expired
    if @cleanInterval > 0 and Date.now() - @lastCleanTime >= @cleanInterval
      setImmediate @clearExpires
    else if expired
      @del(item.id)
    return expired
  # peek a id from LRU Cache, without updating the "recently used"-ness of the key
  peek: (id)->
    result = @_cacheLRU[id]
    return if result is undefined or @isExpired(result)
    result.value
  get: (id)->
    result = @_cacheLRU[id]
    if result isnt undefined and not @isExpired(result)
      if @_lruQueue
        @_lruQueue.use(result)
      result = result.value
    else
      result = undefined
    result
  set: (id, value, expires)->
    setImmediate @clearExpires if @cleanInterval > 0 and Date.now() - @lastCleanTime >= @cleanInterval
    item = @_cacheLRU[id]
    if item isnt undefined
      oldValue = item.value
      item.value = value
      if expires <= 0
        delete item.expires
      else if expires > 0 # skip illegal expires
        item.expires = Date.now() + expires
      else if @maxAge > 0
        item.expires = Date.now() + @maxAge
      event = 'update'
      if @_lruQueue
        @_lruQueue.use(item)
    else
      event = 'add'
      if expires > 0
        expires = Date.now() + expires
      else if @maxAge > 0
        expires = Date.now() + @maxAge
      else expires = undefined
      item = new LRUCacheItem(id, value, expires)
      @_cacheLRU[id] = item
      if @_lruQueue
        delItem = @_lruQueue.add(item)
        @del(delItem.id) if delItem isnt undefined
    @emit(event, id, value, oldValue)
  clear: ->
    oldCache      = @_cacheLRU
    @_cacheLRU     = create(null)
    for k,v of oldCache
      @emit('del', k, v.value)
    if @maxCapacity > 0
      @_lruQueue   = lruQueue(@maxCapacity)
    else
      @_lruQueue   = null
    return @
  reset: (options)->
    if options > 0
      @maxCapacity   = options
      @maxAge        = 0
      @cleanInterval = 0
    else if options
      @maxCapacity   = options.capacity
      @maxAge        = options.expires
      @cleanInterval = options.cleanInterval
      @cleanInterval = @cleanInterval * 1000 if @cleanInterval > 0
    @clear()
  free: ->
    for k,v of _cacheLRU
      @emit('del', k, v)
    @_cacheLRU     = null
    @_lruQueue     = null
    @lastCleanTime = 0
  #executes a provided function once per each value in the cache object, 
  # in order of recent-ness. (more recently used items are iterated over first)
  # callback: Function to execute for each element. callback is invoked with three arguments:
  #   * the element value
  #   * the element key
  #   * the cache object
  # thisArg: Value to use as this when executing callback.
  forEach: (callback, thisArg)->
    setImmediate @clearExpires if @cleanInterval > 0 and Date.now() - @lastCleanTime >= @cleanInterval
    thisArg ||= this
    if @_lruQueue
      @_lruQueue.forEach (item)->
        callback.call thisArg, item.value, item.id, this if not @isExpired item
      , this
    else
      for k,item of @_cacheLRU
        callback.call thisArg, item.value, k, @ if not @isExpired item
    return
  clearExpires: ->
    for k,v of @_cacheLRU
      expires = v.expires
      @del(k) if (v and Date.now() >= expires) or v.value is undefined
    @lastCleanTime = Date.now()
