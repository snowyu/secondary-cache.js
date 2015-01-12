"use strict"

create = Object.create
hasOwnProperty = Object::hasOwnProperty

module.exports = class LRUQueue
  class QueueItem
    constructor: (@value)->
  constructor: (capacity)->
    return new LRUQueue(capacity) if this not instanceof LRUQueue
    @maxCapacity = if capacity > 0 then capacity else 0
    @clear()
  add: (id) ->
    id.lu = @_mru
    @queue[@_mru] = id
    ++@length
    ++@_mru
    result = @queue[@_lru] if @length > @maxCapacity
    result
  use:(id) ->
    @shiftLU id.lu
    id.lu = @_mru
    @queue[@_mru] = id
    ++@_mru
    return
  hit: (id) ->
    if typeof id is 'string' or typeof id is 'number' or typeof id is 'boolean'
      s = id
      if @_map
        id = @_map[s]
        id = new QueueItem s if id is undefined
      else 
        @_map = create(null)
        id = new QueueItem s
      @_map[s]=id
    if id.lu is undefined
      result = @add id
      @del result if result
      if result instanceof QueueItem
        result = result.value
        delete @_map[result]
      result
    else
      @use id

  delete: (id) ->
    if id.lu isnt undefined
      --@length
      if @length
        @shiftLU id.lu
      else
        @_mru = 0
        @_lru = 0
    return
  del: @::delete

  forEach: (callback, thisArg)->
    thisArg ||= this
    k = @_mru
    i = 0
    while --k >= 0 and i < @length
      item = @queue[k]
      if item
        ++i
        callback.call thisArg, item, this
    return
  clear: ->
    @length = 0
    #_mru: most reused index
    #_lru: lest reused index
    @_lru   = 0
    @_mru   = 0
    @queue  = create(null)
    delete @_map
    return

  shiftLU: (lu) ->
    q = @queue
    delete q[lu]
    @_lru++ while @_lru < @_mru and not q[@_lru]
    return

