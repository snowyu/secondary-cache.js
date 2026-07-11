import { describe, it, expect } from 'vitest'

import Cache from '../src/cache'
import LRUCache from '../src/lru-cache'

describe("Weight-based LRUCache", function() {
  describe("LRUCache with weightOf function", function() {
    it('should support custom weightOf function for size-based capacity', function() {
      const cache = LRUCache({
        maxWeight: 20,
        capacity: 0, // unlimited by count
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', 'hello'); // weight: 5
      cache.set('b', 'world'); // weight: 5
      cache.set('c', 'test');  // weight: 4
      expect(cache.length()).toBe(3);
      // Total weight is 14, now adding 'd' with weight 21
      // Item weight exceeds maxWeight, should throw error
      expect(function() {
        cache.set('d', 'this is a long string'); // weight: 21
      }).toThrow('Item weight 21 exceeds maxWeight 20');
      // Cache should remain unchanged
      expect(cache.length()).toBe(3);
      expect(cache.get('a')).toBe('hello');
      expect(cache.get('b')).toBe('world');
      expect(cache.get('c')).toBe('test');
    });

    it('should work with both capacity and maxWeight limits', function() {
      const cache = LRUCache({
        capacity: 3,
        maxWeight: 15,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', 'hello'); // weight: 5
      cache.set('b', 'world'); // weight: 5
      cache.set('c', 'test');  // weight: 4
      expect(cache.length()).toBe(3);
      // Total weight: 14, under maxWeight 15
      cache.set('d', 'hi');    // weight: 2, triggers capacity eviction
      // After eviction, should have 3 items (capacity limit)
      expect(cache.length()).toBe(3);
    });

    it('should update weight when value is updated', function() {
      const cache = LRUCache({
        maxWeight: 20,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', 'hello'); // weight: 5
      cache.set('b', 'world'); // weight: 5
      expect(cache._totalWeight).toBe(10);
      // Update 'a' with a longer string
      cache.set('a', 'hello world!!'); // weight: 13
      expect(cache._totalWeight).toBe(18); // 13 + 5
    });

    it('should use default weightOf (return 1) when not provided', function() {
      const cache = LRUCache({
        maxWeight: 5,
        capacity: 0
      });
      // Default weightOf returns 1, so maxWeight acts like max count
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4);
      cache.set('e', 5);
      expect(cache.length()).toBe(5);
      cache.set('f', 6); // should evict one item
      expect(cache.length()).toBe(5);
      expect(cache.get('a')).toBeUndefined();
    });

    it('should evict LRU items when weight exceeds maxWeight', function() {
      const cache = LRUCache({
        maxWeight: 10,
        weightOf: function(value) {
          return value.size || 1;
        }
      });
      cache.set('a', { size: 4 });
      cache.set('b', { size: 4 });
      cache.set('c', { size: 4 });
      // Total weight: 12, should evict 'a' (LRU)
      expect(cache.length()).toBe(2);
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toEqual({ size: 4 });
      expect(cache.get('c')).toEqual({ size: 4 });
    });

    it('should handle weight calculation via prototype method', function() {
      const cache = LRUCache({
        maxWeight: 100,
        capacity: 0
      });
      // Override prototype method
      cache.weightOf = function(value) {
        return Buffer.byteLength(JSON.stringify(value), 'utf8');
      };
      cache.set('obj', { name: 'test', data: 'hello' });
      cache.set('str', 'a'.repeat(50));
      // Both should fit under 100
      expect(cache.length()).toBe(2);
    });

    it('should correctly track totalWeight after delete', function() {
      const cache = LRUCache({
        maxWeight: 20,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', 'hello'); // weight: 5
      cache.set('b', 'world'); // weight: 5
      cache.set('c', 'test');  // weight: 4
      expect(cache._totalWeight).toBe(14);
      cache.del('b');
      expect(cache._totalWeight).toBe(9);
    });

    it('should correctly track totalWeight after clear', function() {
      const cache = LRUCache({
        maxWeight: 20,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', 'hello');
      cache.set('b', 'world');
      expect(cache._totalWeight).toBe(10);
      cache.clear();
      expect(cache._totalWeight).toBe(0);
      expect(cache.length()).toBe(0);
    });

    it('should evict LRU items based on usage order', function() {
      const cache = LRUCache({
        maxWeight: 10,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', '1234'); // weight: 4
      cache.set('b', '5678'); // weight: 4
      cache.set('c', '90');   // weight: 2
      // Total: 10, LRU order: a, b, c
      cache.get('a'); // Access 'a', now LRU order: b, c, a
      cache.set('d', 'AB');   // weight: 2, total would be 12, evict 'b'
      expect(cache.length()).toBe(3);
      expect(cache.get('b')).toBeUndefined();
      expect(cache.get('a')).toBe('1234');
    });

    it('should evict multiple items when weight greatly exceeded', function() {
      const cache = LRUCache({
        maxWeight: 5,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', '12');   // weight: 2
      cache.set('b', '34');   // weight: 2
      cache.set('c', '56');   // weight: 2, total: 6 > 5, evict 'a'
      expect(cache.length()).toBe(2);
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toBe('34');
      expect(cache.get('c')).toBe('56');
    });

    it('should handle update that triggers eviction', function() {
      const cache = LRUCache({
        maxWeight: 10,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', '123');   // weight: 3
      cache.set('b', '456');   // weight: 3
      cache.set('c', '78');    // weight: 2, total: 8
      // Update 'a' to a much larger value
      cache.set('a', '1234567890'); // weight: 10, total would be 15 > 10
      // Should evict LRU items (b, then c if needed)
      expect(cache.length()).toBe(1);
      expect(cache.get('a')).toBe('1234567890');
    });

    it('should work with maxWeight = 0 (no weight limit)', function() {
      const cache = LRUCache({
        maxWeight: 0,
        capacity: 3,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', 'hello');  // weight: 5
      cache.set('b', 'world');  // weight: 5
      expect(cache._totalWeight).toBe(10);
      cache.set('c', 'test');   // weight: 4, evict by capacity
      expect(cache.length()).toBe(3);
      cache.set('d', 'latest'); // the a should be pop for capacity 3
      expect(cache.get('a')).toBeUndefined();
    });

    it('should emit del event for evicted items', function() {
      const cache = LRUCache({
        maxWeight: 10,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      const evicted = [];
      cache.on('del', (id) => evicted.push(id));

      cache.set('a', '1234'); // weight: 4
      cache.set('b', '5678'); // weight: 4
      cache.set('c', '90');   // weight: 2, total: 10

      expect(evicted.length).toBe(0);
      cache.set('d', 'AB');   // weight: 2, evict 'a'
      expect(evicted).toEqual(['a']);
    });

    it('should throw error when update exceeds maxWeight', function() {
      const cache = LRUCache({
        maxWeight: 10,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', '123'); // weight: 3
      cache.set('b', '456'); // weight: 3
      expect(cache._totalWeight).toBe(6);

      // Update 'a' to exceed maxWeight
      expect(function() {
        cache.set('a', '12345678901'); // weight: 11
      }).toThrow('Item weight 11 exceeds maxWeight 10');

      // Cache should remain unchanged
      expect(cache.get('a')).toBe('123');
      expect(cache._totalWeight).toBe(6);
    });
  });

  describe("Cache with weightOf function", function() {
    it('should support weight-based capacity in LRU portion', function() {
      const cache = Cache({
        maxWeight: 10,
        capacity: 0,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      cache.set('a', '1234'); // weight: 4
      cache.set('b', '5678'); // weight: 4
      // Total weight: 8
      expect(cache.length()).toBe(2);
      cache.set('c', '9012'); // weight: 4, total: 12 > 10, evict 'a'
      expect(cache.length()).toBe(2);
      expect(cache.get('a')).toBeUndefined();
    });

    it('should handle fixed cache separately from weight-based LRU', function() {
      const cache = Cache({
        maxWeight: 10,
        weightOf: function(value) {
          return String(value).length;
        }
      });
      // Fixed cache should not be affected by weight
      cache.set('fixed', 'fixed-value', { fixed: true });
      cache.set('lru', '1234567890'); // weight: 10
      expect(cache.length()).toBe(2);
      // Fixed cache should have its own capacity tracking
      expect(cache.fixedCapacity).toBe(1);
    });
  });

});
