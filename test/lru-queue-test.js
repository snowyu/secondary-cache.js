import { describe, it, expect, beforeEach } from 'vitest'

import LRUQueue from '../src/lru-queue'

describe("LRUQueue", function() {
  describe('Basic operations', function() {
    var queue;
    beforeEach(function() {
      queue = LRUQueue(3);
    });

    it('should initialize with correct capacity', function() {
      expect(queue.maxCapacity).toBe(3);
      expect(queue.length).toBe(0);
    });

    it('should create instance without new keyword', function() {
      var q = LRUQueue(5);
      expect(q).toBeInstanceOf(LRUQueue);
      expect(q.maxCapacity).toBe(5);
    });

    it('should handle capacity of 0 (unlimited)', function() {
      var q = LRUQueue(0);
      expect(q.maxCapacity).toBe(0);
    });

    it('should handle negative capacity (treated as 0/unlimited)', function() {
      var q = LRUQueue(-1);
      expect(q.maxCapacity).toBe(0);
    });

    it('should add items and track length', function() {
      var item1 = {id: 1};
      var item2 = {id: 2};
      expect(queue.add(item1)).toBeUndefined();
      expect(queue.length).toBe(1);
      expect(queue.add(item2)).toBeUndefined();
      expect(queue.length).toBe(2);
    });

    it('should return overflow item when capacity exceeded', function() {
      var item1 = {id: 1};
      var item2 = {id: 2};
      var item3 = {id: 3};
      var item4 = {id: 4};
      queue.add(item1);
      queue.add(item2);
      queue.add(item3);
      expect(queue.add(item4)).toBe(item1);
      expect(queue.length).toBe(3);
    });

    it('should pop the least recently used item', function() {
      var item1 = {id: 1};
      var item2 = {id: 2};
      queue.add(item1);
      queue.add(item2);
      expect(queue.pop()).toBe(item1);
      expect(queue.length).toBe(1);
      expect(queue.pop()).toBe(item2);
      expect(queue.length).toBe(0);
    });

    it('should pop undefined from empty queue', function() {
      expect(queue.pop()).toBeUndefined();
    });

    it('should use (move to MRU) an existing item', function() {
      var item1 = {id: 1};
      var item2 = {id: 2};
      var item3 = {id: 3};
      queue.add(item1);
      queue.add(item2);
      queue.add(item3);
      // Use item1 (move to MRU), now LRU order: item2, item3, item1
      queue.use(item1);
      // Adding a 4th item should pop item2 (the LRU)
      var item4 = {id: 4};
      expect(queue.add(item4)).toBe(item2);
    });

    it('should push as alias for add', function() {
      var item1 = {id: 1};
      expect(queue.push(item1)).toBeUndefined();
      expect(queue.length).toBe(1);
    });

    it('should delete an item from the queue', function() {
      var item1 = {id: 1};
      var item2 = {id: 2};
      var item3 = {id: 3};
      queue.add(item1);
      queue.add(item2);
      queue.add(item3);
      queue.delete(item2);
      expect(queue.length).toBe(2);
      // Fill queue to capacity
      var item4 = {id: 4};
      queue.add(item4);
      expect(queue.length).toBe(3);
      // Adding one more should overflow item1 (LRU)
      var item5 = {id: 5};
      expect(queue.add(item5)).toBe(item1);
    });

    it('should del as alias for delete', function() {
      var item1 = {id: 1};
      queue.add(item1);
      queue.del(item1);
      expect(queue.length).toBe(0);
    });

    it('should clear the queue completely', function() {
      queue.add({id: 1});
      queue.add({id: 2});
      queue.add({id: 3});
      queue.clear();
      expect(queue.length).toBe(0);
      expect(queue._lru).toBe(0);
      expect(queue._mru).toBe(0);
    });

    it('should forEach iterate in MRU-to-LRU order', function() {
      var item1 = {id: 1};
      var item2 = {id: 2};
      var item3 = {id: 3};
      queue.add(item1);
      queue.add(item2);
      queue.add(item3);
      var items = [];
      queue.forEach(function(item) {
        items.push(item.id);
      });
      // MRU-to-LRU order: item3, item2, item1
      expect(items).toEqual([3, 2, 1]);
    });

    it('should forEach stop at length (not visit deleted slots)', function() {
      var item1 = {id: 1};
      var item2 = {id: 2};
      var item3 = {id: 3};
      queue.add(item1);
      queue.add(item2);
      queue.add(item3);
      queue.delete(item2);
      var items = [];
      queue.forEach(function(item) {
        items.push(item.id);
      });
      // Should only iterate existing items: item3, item1
      expect(items).toEqual([3, 1]);
    });

    it('should handle forEach on empty queue', function() {
      var count = 0;
      queue.forEach(function() {
        count++;
      });
      expect(count).toBe(0);
    });
  });

  describe('hit() method', function() {
    var queue;
    beforeEach(function() {
      queue = LRUQueue(3);
    });

    it("should hit LRU correctly with string keys", function() {
      expect(queue.hit("raz")).toBe(undefined);
      expect(queue.hit("raz")).toBe(undefined);
      expect(queue.hit("dwa")).toBe(undefined);
      expect(queue.hit("raz")).toBe(undefined);
      expect(queue.hit("dwa")).toBe(undefined);
      expect(queue.hit("trzy")).toBe(undefined);
      expect(queue.hit("raz")).toBe(undefined);
      expect(queue.hit("dwa")).toBe(undefined);
      expect(queue.hit("cztery")).toBe("trzy");
      expect(queue.hit("dwa")).toBe(undefined);
      expect(queue.hit("trzy")).toBe("raz");
      expect(queue.hit("raz")).toBe("cztery");
      expect(queue.hit("cztery")).toBe("dwa");
      expect(queue.hit("trzy")).toBe(undefined);
      expect(queue.hit("dwa")).toBe("raz");
      expect(queue.hit("cztery")).toBe(undefined);
      queue.del("cztery");
      expect(queue.hit("cztery")).toBe(undefined);
    });

    it('should handle hit with numeric keys', function() {
      expect(queue.hit(1)).toBe(undefined);
      expect(queue.hit(2)).toBe(undefined);
      expect(queue.hit(3)).toBe(undefined);
      expect(queue.hit(4)).toBe(1); // overflow, 1 is LRU
    });

    it('should handle hit with boolean keys', function() {
      var q = LRUQueue(2);
      expect(q.hit(true)).toBe(undefined);
      expect(q.hit(false)).toBe(undefined);
      expect(q.hit(true)).toBe(undefined);
      expect(q.hit(true)).toBe(undefined);
    });

    it('should handle hit with object keys', function() {
      var q = LRUQueue(2);
      var obj1 = {name: 'a'};
      var obj2 = {name: 'b'};
      expect(q.hit(obj1)).toBe(undefined);
      expect(q.hit(obj2)).toBe(undefined);
      expect(q.hit(obj1)).toBe(undefined);
      // Now add a third, should pop obj2
      var obj3 = {name: 'c'};
      expect(q.hit(obj3)).toBe(obj2);
    });
  });
});
