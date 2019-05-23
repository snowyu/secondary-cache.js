export interface LRUQueueItem {
  value?: any;
  lu?: number;
  [name: string]: any;
}
export class LRUQueue {
  constructor(capacity:number);
  add(value: LRUQueueItem): LRUQueueItem|undefined;
  push(value: LRUQueueItem): LRUQueueItem|undefined;
  pop(): LRUQueueItem;
  use(value: LRUQueueItem): void;
  hit(value: LRUQueueItem): LRUQueueItem|undefined;
  delete(value: LRUQueueItem): void;
  del(value: LRUQueueItem): void;
  forEach(callback: (item: LRUQueueItem, thisArg: any)=>void, thisArg?: any): void;
  clear(): void;
  shiftLU(): void;
}
