import { describe, it, expect, afterEach } from 'vitest'

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
      expect(cache.get('key')).toBeUndefined();
      cache.set('key', value);
      expect(cache.get('key')).toBe(value);
    });
    it('should add to cache with expires', function(done) {
      var value;
      value = Math.random();
      expect(cache.get('expiresKey')).toBeUndefined();
      cache.set('expiresKey', value, 50);
      expect(cache.get('expiresKey')).toBe(value);
      setTimeout(function() {
        expect(cache.get('expiresKey')).toBeUndefined();
        done();
      }, 51);
    });
    it('should update a value to cache', function() {
      var oldValue, result, value;
      value = Math.random();
      oldValue = cache.get('key');
      expect(oldValue).toBeDefined();
      cache.set('key', value);
      result = cache.get('key');
      expect(result).toBe(value);
      expect(result).not.toBe(oldValue);
    });
    it('should delete key in cache', function() {
      expect(cache.del("NotFind")).toBe(false);
      cache.set('key', "1");
      expect(cache.del("key")).toBe(true);
    });
    it('should clear cache', function() {
      var k, notEmpty, pairs, v;
      pairs = fillDataTo(cache);
      for (k in pairs) {
        v = pairs[k];
        expect(cache.get(k)).toBe(v);
      }
      cache.clear();
      for (k in pairs) {
        expect(cache.get(k)).toBeUndefined();
      }
      return;
      notEmpty = false;
      cache.forEach(function(v, k, cache) {
        return notEmpty = true;
      });
      return expect(notEmpty).toBe(false);
    });
    it('should forEach cache', function() {
      var count, pairs;
      pairs = fillDataTo(cache);
      count = 0;
      cache.forEach(function(v, k, cache) {
        ++count;
        expect(v).toBe(pairs[k]);
      });
      expect(count).toBe(Object.keys(pairs).length);
    });
    it('should emit the del event when free cache', function() {
      var count, pairs, vCache;
      vCache = new Cache();
      pairs = fillDataTo(vCache);
      count = 0;
      vCache.on('del', function(k, v) {
        ++count;
        expect(v).toBe(pairs[k]);
      });
      vCache.free();
      expect(count).toBe(Object.keys(pairs).length);
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
      expect(count).toBe(0);
    });
  });
  describe("LRU Cache", function() {
    var cache;
    cache = Cache(2);
    it('should least recently set', function() {
      cache.set('a', 'A');
      cache.set('b', 'B');
      cache.set('c', 'C');
      expect(cache.get('c')).toBe('C');
      expect(cache.get('b')).toBe('B');
      expect(cache.get('a')).toBeUndefined();
    });
    it('should lru recently gotten', function() {
      cache.clear();
      cache.set('a', 'A');
      cache.set('b', 'B');
      cache.get('a');
      cache.set('c', 'C');
      expect(cache.get('c')).toBe('C');
      expect(cache.get('a')).toBe('A');
      expect(cache.get('b')).toBeUndefined();
    });
    it('should lru recently gotten 2', function() {
      cache.clear();
      cache.set('a', 'A');
      cache.set('b', 'B');
      cache.set('c', 'C');
      expect(cache.get('c')).toBe('C');
      expect(cache.get('b')).toBe('B');
      expect(cache.get('a')).toBeUndefined();
      cache.set('a', 'A');
      cache.set('b', 'B');
      cache.get('a');
      cache.set('c', 'C');
      expect(cache.get('c')).toBe('C');
      expect(cache.get('a')).toBe('A');
      expect(cache.get('b')).toBeUndefined();
    });
  });
  describe("Events on LRU Cache", function() {
    var cache;
    cache = Cache(2);
    afterEach(function() {
      cache.removeAllListeners();
    });
    it('should listen to "before_add" event', function() {
      return new Promise(function(resolve, reject) {
        var expected;
        expected = Math.random();
        cache.on('before_add', function(key, value) {
          try {
            expect(key).toBe('before_add_key');
            expect(value).toBe(expected);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        cache.set('before_add_key', expected);
      });
    });
    it('should listen to "add" event', function() {
      return new Promise(function(resolve, reject) {
        var expected;
        expected = Math.random();
        cache.on('add', function(key, value) {
          try {
            expect(key).toBe('key');
            expect(value).toBe(expected);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        cache.set('key', expected);
      });
    });
    it('should listen to "before_update" event', function() {
      return new Promise(function(resolve, reject) {
        var newValue, oldValue;
        cache.set('before_add_key', 'initial');
        newValue = Math.random();
        oldValue = cache.get('before_add_key');
        expect(oldValue).toBeDefined();
        cache.on('before_update', function(key, value, aOldValue) {
          try {
            expect(key).toBe('before_add_key');
            expect(value).toBe(newValue);
            expect(aOldValue).toBe(oldValue);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        cache.set('before_add_key', newValue);
        oldValue = cache.get('before_add_key');
        expect(oldValue).toBe(newValue);
      });
    });
    it('should listen to "update" event', function() {
      return new Promise(function(resolve, reject) {
        var newValue, oldValue;
        cache.set('key', 'initial');
        newValue = Math.random();
        oldValue = cache.get('key');
        expect(oldValue).toBeDefined();
        cache.on('update', function(key, value, aOldValue) {
          try {
            expect(key).toBe('key');
            expect(value).toBe(newValue);
            expect(aOldValue).toBe(oldValue);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        cache.set('key', newValue);
        oldValue = cache.get('key');
        expect(oldValue).toBe(newValue);
      });
    });
    it('should listen to "del" event', function() {
      return new Promise(function(resolve, reject) {
        var oldValue;
        cache.set('key', 'initial');
        oldValue = cache.get('key');
        expect(oldValue).toBeDefined();
        cache.on('del', function(key, value) {
          try {
            expect(key).toBe('key');
            expect(value).toBe(oldValue);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        cache.del('key');
        expect(cache.has('key')).toBe(false);
      });
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
        expect(v).toBe(pairs[k]);
      });
      expect(count).toBe(10);
      setTimeout(function() {
        var k, v;
        let isEmpty = true;
        cache.forEach(function() {
          isEmpty = false;
        });
        for (k in pairs) {
          v = pairs[k];
          expect(cache.get(k)).toBeUndefined();
        }
        expect(isEmpty).toBe(true);
        done();
      }, 50);
    });
  });
});
