import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

const should = chai.should();
const expect = chai.expect;
chai.use(sinonChai);

import Cache from '../src/lru-cache'

describe("LRUCache", function() {
  describe("Unlimited Cache", function() {
    var cache, fillDataTo;
    cache = Cache();
    fillDataTo = function(cache) {
      var i, j, key, pairs, value;
      pairs = {};
      for (i = j = 1; j <= 10; i = ++j) {
        key = 'key_' + i;
        value = Math.random();
        cache.set(key, value);
        pairs[key] = value;
      }
      return pairs;
    };
    it('should add a value to cache', function() {
      var value;
      value = Math.random();
      should.not.exist(cache.get('key'));
      cache.set('key', value);
      cache.get('key').should.be.equal(value);
    });
    it('should add to cache with expires', function(done) {
      var value;
      value = Math.random();
      should.not.exist(cache.get('expiresKey'));
      cache.set('expiresKey', value, 50);
      cache.get('expiresKey').should.be.equal(value);
      setTimeout(function() {
        should.not.exist(cache.get('expiresKey'));
        done();
      }, 51);
    });
    it('should update a value to cache', function() {
      var oldValue, result, value;
      value = Math.random();
      oldValue = cache.get('key');
      should.exist(oldValue);
      cache.set('key', value);
      result = cache.get('key');
      result.should.be.equal(value);
      result.should.be.not.equal(oldValue);
    });
    it('should delete key in cache', function() {
      cache.del("NotFind").should.be["false"];
      cache.set('key', "1");
      cache.del("key").should.be["true"];
    });
    it('should clear cache', function() {
      var k, notEmpty, pairs, v;
      pairs = fillDataTo(cache);
      for (k in pairs) {
        v = pairs[k];
        cache.get(k).should.be.equal(v);
      }
      cache.clear();
      for (k in pairs) {
        should.not.exist(cache.get(k));
      }
      return;
      notEmpty = false;
      cache.forEach(function(v, k, cache) {
        return notEmpty = true;
      });
      return notEmpty.should.be["false"];
    });
    it('should forEach cache', function() {
      var count, pairs;
      pairs = fillDataTo(cache);
      count = 0;
      cache.forEach(function(v, k, cache) {
        ++count;
        v.should.be.equal(pairs[k]);
      });
      count.should.be.equal(Object.keys(pairs).length);
    });
    it('should emit the del event when free cache', function() {
      var count, pairs, vCache;
      vCache = new Cache();
      pairs = fillDataTo(vCache);
      count = 0;
      vCache.on('del', function(k, v) {
        ++count;
        v.should.be.equal(pairs[k]);
      });
      vCache.free();
      count.should.be.equal(Object.keys(pairs).length);
    });
    it('should free cache', function() {
      var count, pairs, vCache;
      vCache = new Cache();
      pairs = fillDataTo(vCache);
      vCache.free();
      count = 0;
      vCache.forEach(function(v, k, cache) {
        ++count;
      });
      count.should.be.equal(0);
    });
  });
  describe("LRU Cache", function() {
    var cache;
    cache = Cache(2);
    it('should least recently set', function() {
      cache.set('a', 'A');
      cache.set('b', 'B');
      cache.set('c', 'C');
      cache.get('c').should.be.equal('C');
      cache.get('b').should.be.equal('B');
      should.not.exist(cache.get('a'));
    });
    it('should lru recently gotten', function() {
      cache.clear();
      cache.set('a', 'A');
      cache.set('b', 'B');
      cache.get('a');
      cache.set('c', 'C');
      cache.get('c').should.be.equal('C');
      cache.get('a').should.be.equal('A');
      should.not.exist(cache.get('b'));
    });
    it('should lru recently gotten 2', function() {
      cache.clear();
      cache.set('a', 'A');
      cache.set('b', 'B');
      cache.set('c', 'C');
      cache.get('c').should.be.equal('C');
      cache.get('b').should.be.equal('B');
      should.not.exist(cache.get('a'));
      cache.set('a', 'A');
      cache.set('b', 'B');
      cache.get('a');
      cache.set('c', 'C');
      cache.get('c').should.be.equal('C');
      cache.get('a').should.be.equal('A');
      should.not.exist(cache.get('b'));
    });
  });
  describe("Events on LRU Cache", function() {
    var cache;
    cache = Cache(2);
    it('should listen to "add" event', function(done) {
      var expected;
      expected = Math.random();
      cache.on('add', function(key, value) {
        key.should.be.equal('key');
        value.should.be.equal(expected);
        done();
      });
      cache.set('key', expected);
    });
    it('should listen to "update" event', function(done) {
      var newValue, oldValue;
      newValue = Math.random();
      oldValue = cache.get('key');
      should.exist(oldValue);
      cache.on('update', function(key, value, aOldValue) {
        key.should.be.equal('key');
        value.should.be.equal(newValue);
        aOldValue.should.be.equal(oldValue);
        done();
      });
      cache.set('key', newValue);
      oldValue = cache.get('key');
      oldValue.should.be.equal(newValue);
    });
    it('should listen to "del" event', function(done) {
      var oldValue;
      oldValue = cache.get('key');
      should.exist(oldValue);
      cache.on('del', function(key, value) {
        key.should.be.equal('key');
        value.should.be.equal(oldValue);
        done();
      });
      cache.del('key');
      cache.has('key').should.be["false"];
    });
  });
  describe("MaxAge(options.expires) Cache", function() {
    var cache;
    cache = Cache({
      expires: 50
    });
    it('should expires all items', function(done) {
      var count, i, j, key, pairs, value;
      pairs = {};
      for (i = j = 1; j <= 10; i = ++j) {
        key = 'key_' + i;
        value = Math.random();
        cache.set(key, value);
        pairs[key] = value;
      }
      count = 0;
      cache.forEach(function(v, k, cache) {
        ++count;
        v.should.be.equal(pairs[k]);
      });
      count.should.be.equal(10);
      setTimeout(function() {
        var k, v;
        let isEmpty = true;
        cache.forEach(function() {
          isEmpty = false;
        });
        for (k in pairs) {
          v = pairs[k];
          should.not.exist(cache.get(k));
        }
        isEmpty.should.be["true"];
        done();
      }, 50);
    });
  });
});
