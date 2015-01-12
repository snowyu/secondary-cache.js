chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
should          = chai.should()
expect          = chai.expect
assert          = chai.assert
LRUQueue        = require '../src/lru-queue'
setImmediate    = setImmediate || process.nextTick

chai.use(sinonChai)

describe "LRUQueue", ->
  queue = LRUQueue(3)
  it "should hit LRU correctly", ->
    assert.equal queue.hit("raz"), `undefined`, "Hit #1"
    assert.equal queue.hit("raz"), `undefined`, "Hit #2"
    assert.equal queue.hit("dwa"), `undefined`, "Hit #3"
    assert.equal queue.hit("raz"), `undefined`, "Hit #4"
    assert.equal queue.hit("dwa"), `undefined`, "Hit #5"
    assert.equal queue.hit("trzy"), `undefined`, "Hit #6"
    assert.equal queue.hit("raz"), `undefined`, "Hit #7"
    assert.equal queue.hit("dwa"), `undefined`, "Hit #8"
    assert.equal queue.hit("cztery"), "trzy", "Overflow #1"
    assert.equal queue.hit("dwa"), `undefined`, "Hit #9"
    assert.equal queue.hit("trzy"), "raz", "Overflow #2"
    assert.equal queue.hit("raz"), "cztery", "Overflow #3"
    assert.equal queue.hit("cztery"), "dwa", "Overflow #4"
    assert.equal queue.hit("trzy"), `undefined`, "Hit #10"
    assert.equal queue.hit("dwa"), "raz", "Overflow #4"
    assert.equal queue.hit("cztery"), `undefined`, "Hit #11"
    queue.del "cztery"
    assert.equal queue.hit("cztery"), `undefined`, "Hit #12"
