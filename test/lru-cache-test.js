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
        }, 51);
      });
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
      var k, pairs, v;
      pairs = fillDataTo(cache);
      for (k in pairs) {
        v = pairs[k];
        expect(cache.get(k)).toBe(v);
      }
      cache.clear();
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
    it('should expires all items', function() {
      return new Promise(function(resolve) {
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
          resolve();
        }, 50);
      });
    });
  });

  describe('clearExpires', function() {
    it('should remove expired items from cache', function() {
      var cache = Cache();
      cache.set('a', 'A');
      cache.set('b', 'B', 20);
      expect(cache.length()).toBe(2);
      return new Promise(function(resolve) {
        setTimeout(function() {
          cache.clearExpires();
          expect(cache.length()).toBe(1);
          expect(cache.get('a')).toBe('A');
          expect(cache.get('b')).toBeUndefined();
          resolve();
        }, 30);
      });
    });

    it('should not remove non-expired items', function() {
      var cache = Cache();
      cache.set('a', 'A');
      cache.set('b', 'B', 1000);
      cache.clearExpires();
      expect(cache.length()).toBe(2);
      expect(cache.get('a')).toBe('A');
      expect(cache.get('b')).toBe('B');
    });

    it('should not crash on empty cache', function() {
      var cache = Cache();
      expect(function() {
        cache.clearExpires();
      }).not.toThrow();
    });

    it('should update lastCleanTime after clearExpires', function() {
      var cache = Cache();
      var before = cache.lastCleanTime;
      cache.clearExpires();
      expect(cache.lastCleanTime).toBeGreaterThan(0);
      expect(cache.lastCleanTime).not.toBe(before);
    });
  });

  describe('cleanInterval', function() {
    it('should configure cleanInterval as seconds (multiplied by 1000)', function() {
      var cache = Cache({ cleanInterval: 0.5 });
      expect(cache.cleanInterval).toBe(500);
    });

    it('should default cleanInterval to undefined when not provided', function() {
      var cache = Cache();
      expect(cache.cleanInterval).toBeUndefined();
    });

    it('should default cleanInterval to 0 when constructed with number', function() {
      var cache = Cache(10);
      expect(cache.cleanInterval).toBe(0);
    });

    it('should trigger auto cleanup via setImmediate when interval elapsed', function() {
      var cache = Cache({
        expires: 20,
        cleanInterval: 0.1 // 100ms
      });
      cache.set('key', 'value');
      expect(cache.get('key')).toBe('value');
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          // Force lastCleanTime to be in the past so next operation triggers cleanup
          cache.lastCleanTime = 0;
          // This set() call should trigger setImmediate(() => this.clearExpires())
          cache.set('trigger', 'cleanup');
          // Wait for setImmediate to fire
          setTimeout(function() {
            try {
              // The expired 'key' should have been cleaned up
              expect(cache.get('key')).toBeUndefined();
              resolve();
            } catch (e) {
              reject(e);
            }
          }, 10);
        }, 30);
      });
    });
  });

  describe('Edge Cases', function() {
    it('should peek without changing LRU order', function() {
      var cache = Cache(2);
      cache.set('a', 'A');
      cache.set('b', 'B');
      // Peek 'a' - should NOT change LRU order
      expect(cache.peek('a')).toBe('A');
      // Adding 'c' should evict 'a' (not 'b'), because peek didn't update usage
      cache.set('c', 'C');
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toBe('B');
    });

    it('should peek return undefined for non-existent key', function() {
      var cache = Cache();
      expect(cache.peek('nonexistent')).toBeUndefined();
    });

    it('should isExist and isExists as alias for has', function() {
      var cache = Cache();
      cache.set('key', 'value');
      expect(cache.isExist('key')).toBe(true);
      expect(cache.isExists('key')).toBe(true);
      expect(cache.isExist('nonexistent')).toBe(false);
      expect(cache.isExists('nonexistent')).toBe(false);
    });

    it('should has return false for expired items', function() {
      var cache = Cache({ expires: 10 });
      cache.set('key', 'value');
      expect(cache.has('key')).toBe(true);
      return new Promise(function(resolve) {
        setTimeout(function() {
          expect(cache.has('key')).toBe(false);
          expect(cache.get('key')).toBeUndefined();
          resolve();
        }, 20);
      });
    });

    it('should get return undefined for non-existent key', function() {
      var cache = Cache();
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should support expires = 0 (overrides maxAge for updates)', function() {
      var cache = Cache();
      // For a new item with no maxAge, expires=0 means no expiry
      cache.set('key', 'value');
      expect(cache.get('key')).toBe('value');
      // Update with expires=0 to clear any expiry
      cache.set('key', 'updated', 0);
      expect(cache.get('key')).toBe('updated');
    });

    it('should pass positive expires to LRU cache', function() {
      var cache = Cache();
      return new Promise(function(resolve) {
        cache.set('key', 'value', 20);
        expect(cache.get('key')).toBe('value');
        setTimeout(function() {
          expect(cache.get('key')).toBeUndefined();
          resolve();
        }, 30);
      });
    });

    it('should del return false for non-existent key', function() {
      var cache = Cache();
      expect(cache.del('nonexistent')).toBe(false);
    });

    it('should not throw when clearing empty cache', function() {
      var cache = Cache();
      expect(function() {
        cache.clear();
        cache.free();
        cache.reset();
      }).not.toThrow();
    });

    it('should track totalWeight as read-only property', function() {
      var cache = Cache({
        weightOf: function(v) { return String(v).length; }
      });
      cache.set('a', 'hello');
      cache.set('b', 'world');
      expect(cache.totalWeight).toBe(10);
    });

    it('should handle set with options = null/undefined', function() {
      var cache = Cache();
      cache.set('key', 'value', null);
      expect(cache.get('key')).toBe('value');
      cache.set('key2', 'value2', undefined);
      expect(cache.get('key2')).toBe('value2');
    });

    it('should set with maxCapacity = 0 (unlimited)', function() {
      var cache = Cache(0);
      for (var i = 0; i < 100; i++) {
        cache.set('key' + i, i);
      }
      expect(cache.length()).toBe(100);
    });
  });
});
