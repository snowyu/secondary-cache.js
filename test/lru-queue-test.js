import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
chai.use(sinonChai);

import LRUQueue from '../src/lru-queue'


describe("LRUQueue", function() {
  var queue;
  queue = LRUQueue(3);
  it("should hit LRU correctly", function() {
    assert.equal(queue.hit("raz"), undefined, "Hit #1");
    assert.equal(queue.hit("raz"), undefined, "Hit #2");
    assert.equal(queue.hit("dwa"), undefined, "Hit #3");
    assert.equal(queue.hit("raz"), undefined, "Hit #4");
    assert.equal(queue.hit("dwa"), undefined, "Hit #5");
    assert.equal(queue.hit("trzy"), undefined, "Hit #6");
    assert.equal(queue.hit("raz"), undefined, "Hit #7");
    assert.equal(queue.hit("dwa"), undefined, "Hit #8");
    assert.equal(queue.hit("cztery"), "trzy", "Overflow #1");
    assert.equal(queue.hit("dwa"), undefined, "Hit #9");
    assert.equal(queue.hit("trzy"), "raz", "Overflow #2");
    assert.equal(queue.hit("raz"), "cztery", "Overflow #3");
    assert.equal(queue.hit("cztery"), "dwa", "Overflow #4");
    assert.equal(queue.hit("trzy"), undefined, "Hit #10");
    assert.equal(queue.hit("dwa"), "raz", "Overflow #4");
    assert.equal(queue.hit("cztery"), undefined, "Hit #11");
    queue.del("cztery");
    assert.equal(queue.hit("cztery"), undefined, "Hit #12");
  });
});
