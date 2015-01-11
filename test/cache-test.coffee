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
      cache.set 'expiresKey', value, 100
      cache.get('expiresKey').should.be.equal value
      setTimeout ->
        should.not.exist cache.get('expiresKey')
        done()
      , 100
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
      value = Math.random()
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
  describe "LRU Cache", ->
