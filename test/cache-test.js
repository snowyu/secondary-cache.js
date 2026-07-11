import { describe, it, expect, afterEach } from 'vitest'

import Cache from '../src/cache'


describe("Cache", function() {
  describe("Unlimited Cache", function() {
    var cache, fillDataTo;
    cache = Cache();
    afterEach(function() {
      cache.clear();
    });
    fillDataTo = function(cache) {
      var i, j, key, l, pairs, value;
      pairs = {};
      for (i = j = 1; j <= 10; i = ++j) {
        key = 'fixedkey_' + i;
        value = Math.random();
        cache.setFixed(key, value);
        pairs[key] = value;
      }
      for (i = l = 1; l <= 10; i = ++l) {
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
    it('should add to cache with expires', function() {
      return new Promise(function(resolve) {
        var value;
        value = Math.random();
        expect(cache.get('expiresKey')).toBeUndefined();
        cache.set('expiresKey', value, 50);
        expect(cache.get('expiresKey')).toBe(value);
        setTimeout(function() {
          expect(cache.get('expiresKey')).toBeUndefined();
          resolve();
        }, 50);
      });
    });
    it('should update a value to cache', function() {
      var oldValue, result, value;
      cache.set('key', 'initial');
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
      expect(cache.length()).toBe(Object.keys(pairs).length);
      cache.clear();
      expect(cache.length()).toBe(0);
      for (k in pairs) {
        expect(cache.get(k)).toBeUndefined();
      }
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
  describe("Unlimited Fixed Cache", function() {
    var cache;
    cache = Cache();
    it('should add to the first level fixed cache via .setFixed', function() {
      var value;
      value = Math.random();
      expect(cache.get('key')).toBeUndefined();
      cache.setFixed('key', value);
      expect(cache.get('key')).toBe(value);
      expect(cache.getFixed('key')).toBe(value);
      expect(cache.length()).toBe(1);
    });
    it('should add to the first level fixed cache via .set with options.fixed=true', function() {
      var value;
      cache.clear();
      value = Math.random();
      expect(cache.get('key')).toBeUndefined();
      cache.set('key', value, {
        fixed: true
      });
      expect(cache.get('key')).toBe(value);
      expect(cache.getFixed('key')).toBe(value);
    });
    it('should set to the first level cache if the key is exists in it', function() {
      var oldValue, result, value;
      cache.clear();
      oldValue = Math.random();
      cache.set('key', oldValue, {
        fixed: true
      });
      value = oldValue+1;
      oldValue = cache.get('key');
      expect(oldValue).toBeDefined();
      cache.set('key', value);
      result = cache.get('key');
      expect(result).toBe(value);
      expect(result).not.toBe(oldValue);
      result = cache.getLRU('key');
      expect(result).toBeUndefined();
    });
    it('should get to the first level cache if the key is exists both in two caches', function() {
      var oldValue, result, value;
      value = Math.random();
      oldValue = cache.get('key');
      expect(oldValue).toBeDefined();
      expect(cache.getFixed('key')).toBe(oldValue);
      cache.setLRU('key', value);
      result = cache.getLRU('key');
      expect(result).toBe(value);
      result = cache.get('key');
      expect(result).not.toBe(value);
      expect(result).toBe(oldValue);
    });
    it('should del to the first level cache', function() {
      expect(cache.del("key")).toBe(true);
      expect(cache.hasFixed("key")).toBe(false);
      expect(cache.hasLRU("key")).toBe(true);
      expect(cache.del("key")).toBe(true);
      expect(cache.hasFixed("key")).toBe(false);
      expect(cache.hasLRU("key")).toBe(false);
      expect(cache.has("key")).toBe(false);
      expect(cache.del("key")).toBe(false);
    });
    it('should length fixed cache and lru cache', function() {
      cache.set('key', 123, {fixed: true});
      cache.set('k', 123, {fixed: true});
      cache.set('key2', 1);
      cache.set('key3', 5);
      expect(cache.length()).toBe(4);
      expect(cache.fixedCapacity).toBe(2);
    });
  });
  describe("Fixed Cache with capacity", function() {
    var cache;
    cache = Cache({
      fixedCapacity: 2
    });
    it('should throw error when adding exceed fixed cache capacity', function() {
      cache.setFixed('a', 1);
      cache.setFixed('b', 2);
      expect(function() { cache.setFixed('c', 3); }).toThrow(/max capacity exceed/);
    });
    it('should add to cache after deleting', function() {
      cache.delFixed('a');
      cache.setFixed('c', 3);
    });
  });
  describe("LRU Cache", function() {
    var cache;
    cache = Cache(2);
    it('should least recently set', function() {
      cache.set('a', 'A');
      cache.set('b', 'B');
      cache.set('c', 'C');
      expect(cache.length()).toBe(2);
      expect(cache.get('c')).toBe('C');
      expect(cache.get('b')).toBe('B');
      expect(cache.get('a')).toBeUndefined();
      expect(cache.peek('c')).toBe('C');
      cache.set('d', 'D');
      expect(cache.get('c')).toBeUndefined();
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
  describe("Events on Fixed Cache", function() {
    var cache;
    cache = Cache();
    afterEach(function() {
      cache.removeAllListeners();
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
        cache.set('key', expected, {
          fixed: true
        });
        expect(cache.getFixed('key')).toBe(expected);
      });
    });
    it('should listen to "update" event', function() {
      return new Promise(function(resolve, reject) {
        var newValue, oldValue;
        cache.set('key', 'initial', { fixed: true });
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
        expect(cache.getFixed('key')).toBe(newValue);
      });
    });
    it('should listen to "del" event', function() {
      return new Promise(function(resolve, reject) {
        var oldValue;
        cache.set('key', 'initial', { fixed: true });
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
        expect(cache.hasFixed('key')).toBe(false);
      });
    });
    it('should listen to "before_add" event', function() {
      const expected = {key: Math.random(), key2: Math.random()};
      cache.size=0
      cache.on('before_add', function(key, value) {
        const target=this.target
        if (target.size >= 2) {
          target.clear();
          target.size = 0;
        }
        target.size++
        if (key in expected) {
          expect(value).toBe(expected[key]);
        }
      });
      Object.keys(expected).forEach(function(key) {
        cache.set(key, expected[key], {
          fixed: true
        });
        expect(cache.getFixed(key)).toBe(expected[key]);
      })
      expect(cache.size).toBe(2)
      cache.set('key3', 124, {
        fixed: true
      });
      expect(cache.getFixed('key3')).toBe(124);
      expect(cache.fixedCapacity).toBe(1)
    });
  });
  describe("Events on LRU Cache", function() {
    var cache;
    cache = Cache(6);
    afterEach(function() {
      cache.removeAllListeners();
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
    it('should listen to "before_add" event', function() {
      const expected = {key: Math.random(), key2: Math.random()};
      cache.size=0
      cache.on('before_add', function(key, value) {
        const target=this.target
        if (target.size >= 2) {
          target.clear();
          target.size = 0;
        }
        target.size++
        if (key in expected) {
          expect(value).toBe(expected[key]);
        }
      });
      Object.keys(expected).forEach(function(key) {
        cache.set(key, expected[key]);
        expect(cache.get(key)).toBe(expected[key]);
      })
      expect(cache.size).toBe(2)
      expect(cache._lruQueue.length).toBe(2)
      cache.set('key3', 124);
      expect(cache.fixedCapacity).toBe(0)
      expect(cache.size).toBe(1)
      expect(cache._lruQueue.length).toBe(1)
    });
  });
  describe("MaxAge(options.expires) Cache", function() {
    const cache = Cache({
      expires: 50
    });
    it('should expires all items', function() {
      return new Promise(function(resolve) {
        let count, i, j, key, value;
        const pairs = {};
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
          resolve();
        }, 50);
      });
    });
  });
});
