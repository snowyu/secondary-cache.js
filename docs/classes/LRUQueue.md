[secondary-cache](../README.md) / [Exports](../modules.md) / LRUQueue

# Class: LRUQueue

Creates a new `LRUQueue` object with the given `capacity`.

**`Param`**

The maximum number of items the queue can hold.

## Table of contents

### Constructors

- [constructor](LRUQueue.md#constructor)

### Properties

- [\_mru](LRUQueue.md#_mru)
- [length](LRUQueue.md#length)
- [maxCapacity](LRUQueue.md#maxcapacity)

### Methods

- [add](LRUQueue.md#add)
- [clear](LRUQueue.md#clear)
- [del](LRUQueue.md#del)
- [delete](LRUQueue.md#delete)
- [forEach](LRUQueue.md#foreach)
- [hit](LRUQueue.md#hit)
- [pop](LRUQueue.md#pop)
- [push](LRUQueue.md#push)
- [shiftLU](LRUQueue.md#shiftlu)
- [use](LRUQueue.md#use)

## Constructors

### constructor

• **new LRUQueue**(`capacity`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `capacity` | `number` |

#### Defined in

[lru-queue.d.ts:31](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L31)

## Properties

### \_mru

• `Private` **\_mru**: `number`

most recently used to keep track of the next available position

#### Defined in

[lru-queue.d.ts:29](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L29)

___

### length

• **length**: `number`

#### Defined in

[lru-queue.d.ts:25](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L25)

___

### maxCapacity

• **maxCapacity**: `number`

#### Defined in

[lru-queue.d.ts:24](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L24)

## Methods

### add

▸ **add**(`value`): [`LRUQueueItem`](../interfaces/LRUQueueItem.md)

Adds the given `value` to the queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | [`LRUQueueItem`](../interfaces/LRUQueueItem.md) | The value to add to the queue. |

#### Returns

[`LRUQueueItem`](../interfaces/LRUQueueItem.md)

The item that was removed from the queue, if any.

#### Defined in

[lru-queue.d.ts:38](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L38)

___

### clear

▸ **clear**(): `void`

Removes all items from the queue.

#### Returns

`void`

#### Defined in

[lru-queue.d.ts:95](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L95)

___

### del

▸ **del**(`value`): `void`

Alias for `delete()`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | [`LRUQueueItem`](../interfaces/LRUQueueItem.md) | The value to remove from the queue. |

#### Returns

`void`

#### Defined in

[lru-queue.d.ts:82](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L82)

___

### delete

▸ **delete**(`value`): `void`

Removes the given `value` from the queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | [`LRUQueueItem`](../interfaces/LRUQueueItem.md) | The value to remove from the queue. |

#### Returns

`void`

#### Defined in

[lru-queue.d.ts:75](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L75)

___

### forEach

▸ **forEach**(`callback`, `thisArg?`): `void`

Calls the given `callback` function for each item in the queue, in most- to least-recently used order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | (`item`: [`LRUQueueItem`](../interfaces/LRUQueueItem.md), `thisArg`: `any`) => `void` | The function to call for each item in the queue. |
| `thisArg?` | `any` | The value of `this` to use when calling the `callback` function. |

#### Returns

`void`

#### Defined in

[lru-queue.d.ts:90](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L90)

___

### hit

▸ **hit**(`value`): [`LRUQueueItem`](../interfaces/LRUQueueItem.md)

first check the given `value` whether exists in the queue,  if not exists, adds to the queue, or use it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `boolean` \| [`LRUQueueItem`](../interfaces/LRUQueueItem.md) | The value to use or add to the queue. |

#### Returns

[`LRUQueueItem`](../interfaces/LRUQueueItem.md)

The value of the item that was removed from the queue, if any.

#### Defined in

[lru-queue.d.ts:68](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L68)

___

### pop

▸ **pop**(): [`LRUQueueItem`](../interfaces/LRUQueueItem.md)

Removes and returns the least recently used item from the queue.

#### Returns

[`LRUQueueItem`](../interfaces/LRUQueueItem.md)

The least recently used item in the queue.

#### Defined in

[lru-queue.d.ts:53](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L53)

___

### push

▸ **push**(`value`): [`LRUQueueItem`](../interfaces/LRUQueueItem.md)

Alias for `add()`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | [`LRUQueueItem`](../interfaces/LRUQueueItem.md) | The value to add to the queue. |

#### Returns

[`LRUQueueItem`](../interfaces/LRUQueueItem.md)

The item that was removed from the queue, if any.

#### Defined in

[lru-queue.d.ts:46](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L46)

___

### shiftLU

▸ **shiftLU**(): `void`

Shifts the least recently used position in the queue to the first used position.

#### Returns

`void`

#### Defined in

[lru-queue.d.ts:100](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L100)

___

### use

▸ **use**(`value`): `void`

Moves the given `value` to the most recently used position in the queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | [`LRUQueueItem`](../interfaces/LRUQueueItem.md) | The `value` to move to the most recently used position in the queue. |

#### Returns

`void`

#### Defined in

[lru-queue.d.ts:60](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-queue.d.ts#L60)
