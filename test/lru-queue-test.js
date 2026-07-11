import { describe, it, expect } from 'vitest'

import LRUQueue from '../src/lru-queue'


describe("LRUQueue", function() {
  var queue;
  queue = LRUQueue(3);
  it("should hit LRU correctly", function() {
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
});
