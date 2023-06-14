/**
 * Creates a new `QueueItem` object with the given value.
 *
 */
export interface LRUQueueItem {
  /**
   * The value to store in the queue item.
   */
  value?: any;
  /**
   * last used index
   */
  lu?: number;
  [name: string]: any;
}

/**
 * Creates a new `LRUQueue` object with the given `capacity`.
 *
 * @param {number} capacity - The maximum number of items the queue can hold.
 * @returns {LRUQueue} The new `LRUQueue` object.
 */
export class LRUQueue {
  maxCapacity: number;
  length: number;
  /**
   * most recently used to keep track of the next available position
   */
  private _mru: number;

  constructor(capacity:number);
  /**
   * Adds the given `value` to the queue.
   *
   * @param value - The value to add to the queue.
   * @returns The item that was removed from the queue, if any.
   */
  add(value: LRUQueueItem): LRUQueueItem|undefined;

  /**
   * Alias for `add()`.
   *
   * @param value - The value to add to the queue.
   * @returns The item that was removed from the queue, if any.
   */
  push(value: LRUQueueItem): LRUQueueItem|undefined;

  /**
   * Removes and returns the least recently used item from the queue.
   *
   * @returns {*} The least recently used item in the queue.
   */
  pop(): LRUQueueItem;

  /**
   * Moves the given `value` to the most recently used position in the queue.
   *
   * @param value - The `value` to move to the most recently used position in the queue.
   */
  use(value: LRUQueueItem): void;

  /**
   * first check the given `value` whether exists in the queue,  if not exists, adds to the queue, or use it.
   *
   * @param value - The value to use or add to the queue.
   * @returns The value of the item that was removed from the queue, if any.
   */
  hit(value: LRUQueueItem|string|number|boolean): LRUQueueItem|undefined;

  /**
   * Removes the given `value` from the queue.
   *
   * @param value - The value to remove from the queue.
   */
  delete(value: LRUQueueItem): void;

  /**
   * Alias for `delete()`.
   *
   * @param value - The value to remove from the queue.
   */
  del(value: LRUQueueItem): void;

  /**
   * Calls the given `callback` function for each item in the queue, in most- to least-recently used order.
   *
   * @param callback - The function to call for each item in the queue.
   * @param [thisArg=this] - The value of `this` to use when calling the `callback` function.
   */
  forEach(callback: (item: LRUQueueItem, thisArg: any)=>void, thisArg?: any): void;

  /**
   * Removes all items from the queue.
   */
  clear(): void;

  /**
   * Shifts the least recently used position in the queue to the first used position.
   */
  shiftLU(): void;
}
