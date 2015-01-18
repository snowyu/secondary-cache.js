isEmpty         = require('abstract-object/lib/util/isEmpty')
chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
should          = chai.should()
expect          = chai.expect
Cache           = require '../src/cache'
setImmediate    = setImmediate || process.nextTick

chai.use(sinonChai)

describe "Cache", ->
    #before (done)->
    #after (done)->
  describe "Unlimited Cache", ->
    cache = Cache()
    it 'should add a value to cache', ->
      value = Math.random()
      should.not.exist cache.get('key')
      cache.set 'key', value
      cache.get('key').should.be.equal value
    it 'should add to cache with expires', (done)->
      value = Math.random()
      should.not.exist cache.get('expiresKey')
      cache.set 'expiresKey', value, 50
      cache.get('expiresKey').should.be.equal value
      setTimeout ->
        should.not.exist cache.get('expiresKey')
        done()
      , 50
    it 'should update a value to cache', ->
      value = Math.random()
      oldValue = cache.get('key')
      should.exist oldValue
      cache.set 'key', value
      result = cache.get('key')
      result.should.be.equal value
      result.should.be.not.equal oldValue
    it 'should delete key in cache', ->
      cache.del("NotFind").should.be.false
      cache.set 'key', "1"
      cache.del("key").should.be.true
    it 'should clear cache', ->
      value = Math.random()
      pairs = {}
      for i in [1..10]
        key = 'key_'+ i
        value = Math.random()
        cache.set key, value
        pairs[key] = value
      for k,v of pairs
        cache.get(k).should.be.equal v
      cache.clear()
      for k of pairs
        should.not.exist cache.get(k)
      return
      notEmpty = false
      cache.forEach (v,k,cache)->
        notEmpty = true
      notEmpty.should.be.false

    it 'should forEach cache', ->
      pairs = {}
      for i in [1..10]
        key = 'fixedkey_'+ i
        value = Math.random()
        cache.setFixed key, value
        pairs[key] = value
      for i in [1..10]
        key = 'key_'+ i
        value = Math.random()
        cache.set key, value
        pairs[key] = value
      count = 0
      cache.forEach (v,k,cache)->
        ++count
        v.should.be.equal pairs[k]
      count.should.be.equal 20
    it 'should free cache', ->
      cache.free()
      count = 0
      cache.forEach (v,k,cache)->
        ++count
      count.should.be.equal 0
  describe "Unlimited Fixed Cache", ->
    cache = Cache()
    it 'should add to the first level fixed cache via .setFixed', ->
      value = Math.random()
      should.not.exist cache.get('key')
      cache.setFixed 'key', value
      cache.get('key').should.be.equal value
      cache.getFixed('key').should.be.equal value
    it 'should add to the first level fixed cache via .set with options.fixed=true', ->
      cache.clear()
      value = Math.random()
      should.not.exist cache.get('key')
      cache.set 'key', value, fixed: true
      cache.get('key').should.be.equal value
      cache.getFixed('key').should.be.equal value
    it 'should set to the first level cache if the key is exists in it', ->
      value = Math.random()
      oldValue = cache.get('key')
      should.exist oldValue
      cache.set 'key', value
      result = cache.get('key')
      result.should.be.equal value
      result.should.be.not.equal oldValue
      result = cache.getLRU 'key'
      should.not.exist result
    it 'should get to the first level cache if the key is exists both in two caches', ->
      value = Math.random()
      oldValue = cache.get('key')
      should.exist oldValue
      cache.getFixed('key').should.be.equal oldValue
      cache.setLRU 'key', value
      result = cache.getLRU 'key'
      result.should.be.equal value
      result = cache.get('key')
      result.should.not.be.equal value
      result.should.be.equal oldValue
    it 'should del to the first level cache', ->
      cache.del("key").should.be.true
      cache.hasFixed("key").should.not.be.true
      cache.hasLRU("key").should.be.true
      cache.del("key").should.be.true
      cache.hasFixed("key").should.not.be.true
      cache.hasLRU("key").should.not.be.true
      cache.has("key").should.not.be.true
      cache.del("key").should.be.false
  describe "Fixed Cache with capacity", ->
    cache = Cache fixedCapacity: 2
    it 'should throw error when adding exceed fixed cache capacity', ->
      cache.setFixed 'a', 1
      cache.setFixed 'b', 2
      should.throw cache.setFixed.bind(cache, 'c', 3), /max capacity exceed/
    it 'should add to cache after deleting', ->
      cache.delFixed 'a'
      cache.setFixed 'c', 3
  describe "LRU Cache", ->
    cache = Cache(2)
    it 'should least recently set', ->
      cache.set 'a', 'A'
      cache.set 'b', 'B'
      cache.set 'c', 'C'
      cache.get('c').should.be.equal 'C'
      cache.get('b').should.be.equal 'B'
      should.not.exist cache.get('a')
    it 'should lru recently gotten', ->
      cache.clear()

      cache.set 'a', 'A'
      cache.set 'b', 'B'
      cache.get 'a'
      cache.set 'c', 'C'
      cache.get('c').should.be.equal 'C'
      cache.get('a').should.be.equal 'A'
      should.not.exist cache.get('b')
    it 'should lru recently gotten 2', ->
      cache.clear()
      cache.set 'a', 'A'
      cache.set 'b', 'B'
      cache.set 'c', 'C'
      cache.get('c').should.be.equal 'C'
      cache.get('b').should.be.equal 'B'
      should.not.exist cache.get('a')
      cache.set 'a', 'A'
      cache.set 'b', 'B'
      cache.get 'a'
      cache.set 'c', 'C'
      cache.get('c').should.be.equal 'C'
      cache.get('a').should.be.equal 'A'
      should.not.exist cache.get('b')

  describe "Events on Fixed Cache", ->
    cache = Cache()
    it 'should listen to "add" event', (done)->
      expected = Math.random()
      cache.on 'add', (key, value)->
        key.should.be.equal 'key'
        value.should.be.equal expected
        done()
      cache.set 'key', expected, fixed: true
      cache.getFixed('key').should.be.equal expected
    it 'should listen to "update" event', (done)->
      newValue = Math.random()
      oldValue = cache.get 'key'
      should.exist oldValue
      cache.on 'update', (key, value, aOldValue)->
        key.should.be.equal 'key'
        value.should.be.equal newValue
        aOldValue.should.be.equal oldValue
        done()
      cache.set 'key', newValue
      oldValue = cache.get 'key'
      oldValue.should.be.equal newValue
      cache.getFixed('key').should.be.equal newValue
    it 'should listen to "del" event', (done)->
      oldValue = cache.get 'key'
      should.exist oldValue
      cache.on 'del', (key, value)->
        key.should.be.equal 'key'
        value.should.be.equal oldValue
        done()
      cache.del 'key'
      cache.has('key').should.be.false
      cache.hasFixed('key').should.be.false
  describe "Events on LRU Cache", ->
    cache = Cache(2)
    it 'should listen to "add" event', (done)->
      expected = Math.random()
      cache.on 'add', (key, value)->
        key.should.be.equal 'key'
        value.should.be.equal expected
        done()
      cache.set 'key', expected
    it 'should listen to "update" event', (done)->
      newValue = Math.random()
      oldValue = cache.get 'key'
      should.exist oldValue
      cache.on 'update', (key, value, aOldValue)->
        key.should.be.equal 'key'
        value.should.be.equal newValue
        aOldValue.should.be.equal oldValue
        done()
      cache.set 'key', newValue
      oldValue = cache.get 'key'
      oldValue.should.be.equal newValue
    it 'should listen to "del" event', (done)->
      oldValue = cache.get 'key'
      should.exist oldValue
      cache.on 'del', (key, value)->
        key.should.be.equal 'key'
        value.should.be.equal oldValue
        done()
      cache.del 'key'
      cache.has('key').should.be.false
  describe "MaxAge(options.expires) Cache", ->
    cache = Cache expires: 50
    it 'should expires all items', (done)->
      pairs = {}
      for i in [1..10]
        key = 'key_'+ i
        value = Math.random()
        cache.set key, value
        pairs[key] = value
      count = 0
      cache.forEach (v,k,cache)->
        ++count
        v.should.be.equal pairs[k]
      count.should.be.equal 10
      setTimeout ->
        isEmpty = true
        cache.forEach ->isEmpty=false
        for k,v of pairs
          should.not.exist cache.get k
        isEmpty.should.be.true
        done()
      , 50
