[secondary-cache](../README.md) / [Exports](../modules.md) / LRUCache

# Class: LRUCache

Least Recently Used (LRU) Cache.

**`Example`**

```ts
const cache = new LRUCache({
    capacity: 100,
    expires: 30000, // 30 seconds
    cleanInterval: 60 // 1 minute
  });
  cache.set('key1', 'value1', 5000); // add an item with expiration time of 5 seconds
  cache.set('key2', 'value2'); // add an item with default expiration time
  cache.get('key1'); // returns 'value1'
  cache.forEach((value, key, cache) => console.log(key, value)); // iterates over each item in the cache
  cache.delete('key1'); // removes the item with key 'key1'
  cache.clear(); // removes all items from the cache
  cache.free(); // frees up the memory used by the cache
```

## Hierarchy

- **`LRUCache`**

  ↳ [`Cache`](Cache.md)

## Table of contents

### Constructors

- [constructor](LRUCache.md#constructor)

### Properties

- [\_cacheLRU](LRUCache.md#_cachelru)
- [\_lruQueue](LRUCache.md#_lruqueue)
- [\_totalWeight](LRUCache.md#_totalweight)
- [cleanInterval](LRUCache.md#cleaninterval)
- [maxAge](LRUCache.md#maxage)
- [maxCapacity](LRUCache.md#maxcapacity)
- [maxWeight](LRUCache.md#maxweight)
- [totalWeight](LRUCache.md#totalweight)

### Methods

- [clear](LRUCache.md#clear)
- [clearExpires](LRUCache.md#clearexpires)
- [del](LRUCache.md#del)
- [delListener](LRUCache.md#dellistener)
- [delete](LRUCache.md#delete)
- [forEach](LRUCache.md#foreach)
- [free](LRUCache.md#free)
- [get](LRUCache.md#get)
- [has](LRUCache.md#has)
- [isExist](LRUCache.md#isexist)
- [isExists](LRUCache.md#isexists)
- [isExpired](LRUCache.md#isexpired)
- [length](LRUCache.md#length)
- [off](LRUCache.md#off)
- [on](LRUCache.md#on)
- [peek](LRUCache.md#peek)
- [reset](LRUCache.md#reset)
- [set](LRUCache.md#set)
- [setDefaultOptions](LRUCache.md#setdefaultoptions)
- [weightOf](LRUCache.md#weightof)

## Constructors

### constructor

• **new LRUCache**(`options?`)

Represents a Least Recently Used (LRU) Cache.

**`Example`**

```ts
const cache = new LRUCache({
    capacity: 100,
    expires: 30000, // 30 seconds
    cleanInterval: 60 // 1 minute
  });
  cache.set('key1', 'value1', 5000); // add an item with expiration time of 5 seconds
  cache.set('key2', 'value2'); // add an item with default expiration time
  cache.get('key1'); // returns 'value1'
  cache.forEach((value, key, cache) => console.log(key, value)); // iterates over each item in the cache
  cache.delete('key1'); // removes the item with key 'key1'
  cache.clear(); // removes all items from the cache
  cache.free(); // frees up the memory used by the cache
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `number` \| [`ILRUCacheOptions`](../interfaces/ILRUCacheOptions.md) | Optional the configuration options object for the cache or the max capacity number. |

#### Defined in

[lru-cache.d.ts:96](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L96)

## Properties

### \_cacheLRU

• **\_cacheLRU**: `Object`

#### Defined in

[lru-cache.d.ts:65](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L65)

___

### \_lruQueue

• **\_lruQueue**: [`LRUQueue`](LRUQueue.md)

#### Defined in

[lru-cache.d.ts:66](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L66)

___

### \_totalWeight

• **\_totalWeight**: `number`

#### Defined in

[lru-cache.d.ts:67](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L67)

___

### cleanInterval

• **cleanInterval**: `number`

#### Defined in

[lru-cache.d.ts:63](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L63)

___

### maxAge

• **maxAge**: `number`

#### Defined in

[lru-cache.d.ts:62](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L62)

___

### maxCapacity

• **maxCapacity**: `number`

#### Defined in

[lru-cache.d.ts:60](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L60)

___

### maxWeight

• **maxWeight**: `number`

#### Defined in

[lru-cache.d.ts:61](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L61)

___

### totalWeight

• `Readonly` **totalWeight**: `number`

The total weight of all items in the cache (read-only).
Only meaningful when using weight-based capacity (maxWeight > 0).

#### Defined in

[lru-cache.d.ts:73](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L73)

## Methods

### clear

▸ **clear**(): [`LRUCache`](LRUCache.md)

Deletes all items from the cache.

**`Example`**

```ts
cache.clear(); // removes all items from the cache
```

#### Returns

[`LRUCache`](LRUCache.md)

- Returns the cache instance.

#### Defined in

[lru-cache.d.ts:192](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L192)

___

### clearExpires

▸ **clearExpires**(): `any`

Deletes all expires items from the cache.

**`Example`**

```ts
cache.clearExpires(); // removes all expires items from the cache
```

#### Returns

`any`

- Returns the cache instance.

#### Defined in

[lru-cache.d.ts:218](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L218)

___

### del

▸ **del**(`id`, `isInternal?`): `boolean`

Alias for `delete()`.

**`Example`**

```ts
cache.del('key1'); // removes the item with key 'key1'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The key of the item to delete. |
| `isInternal?` | `boolean` | Indicates whether the function is called internally. |

#### Returns

`boolean`

- Returns `true` if the item was deleted, or `false` if the item was not found in the cache.

#### Defined in

[lru-cache.d.ts:148](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L148)

___

### delListener

▸ **delListener**(`type`, `listener`): [`LRUCache`](LRUCache.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `Function` |

#### Returns

[`LRUCache`](LRUCache.md)

#### Defined in

[lru-cache.d.ts:97](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L97)

___

### delete

▸ **delete**(`id`, `isInternal?`): `boolean`

Deletes an item from the cache.

**`Example`**

```ts
cache.delete('key1'); // removes the item with key 'key1'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The key of the item to delete. |
| `isInternal?` | `boolean` | Indicates whether the function is called internally. |

#### Returns

`boolean`

- Returns `true` if the item was deleted, or `false` if the item was not found in the cache.

#### Defined in

[lru-cache.d.ts:138](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L138)

___

### forEach

▸ **forEach**(`callback`, `thisArg?`): `void`

Iterates over each item in the cache and calls a function for each item.

**`Example`**

```ts
cache.forEach((value, key, cache) => console.log(key, value));
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | (`value`: `any`, `id`: `any`, `thisArg`: `any`) => `void` | The function to call for each item. The function should accept three arguments: `value`, `id`, and `this`. |
| `thisArg?` | `any` | The `this` value to use when calling the function. |

#### Returns

`void`

#### Defined in

[lru-cache.d.ts:210](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L210)

___

### free

▸ **free**(): `any`

Frees up the memory used by the cache.

**`Example`**

```ts
cache.free(); // frees up the memory used by the cache
```

#### Returns

`any`

- Returns the timestamp of the last cleanup operation.

#### Defined in

[lru-cache.d.ts:201](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L201)

___

### get

▸ **get**(`id`): `any`

Returns the value of an item in the cache and updates its last-used time.

**`Example`**

```ts
const value = cache.get('key1');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The key of the item to retrieve. |

#### Returns

`any`

- Returns the value of the item, or `undefined` if the item was not found in the cache or has expired.

#### Defined in

[lru-cache.d.ts:172](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L172)

___

### has

▸ **has**(`id`): `boolean`

Checks whether an item exists in the cache.

**`Example`**

```ts
const exists = cache.has("someItem");
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | the id to check |

#### Returns

`boolean`

- True if the item exists in the cache, false otherwise.

#### Defined in

[lru-cache.d.ts:107](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L107)

___

### isExist

▸ **isExist**(`id`): `boolean`

Wether the id is in the cache

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | the id to check |

#### Returns

`boolean`

#### Defined in

[lru-cache.d.ts:112](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L112)

___

### isExists

▸ **isExists**(`id`): `boolean`

Wether the id is in the cache

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | the id to check |

#### Returns

`boolean`

#### Defined in

[lru-cache.d.ts:117](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L117)

___

### isExpired

▸ **isExpired**(`item`): `boolean`

Check the item whether already expired, the item will be removed from the cache if expired

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | [`LRUCacheItem`](../interfaces/LRUCacheItem.md) | the item to check |

#### Returns

`boolean`

#### Defined in

[lru-cache.d.ts:154](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L154)

___

### length

▸ **length**(): `number`

Get the number of items in the cache.

#### Returns

`number`

The number of items in the LRUCache.

#### Defined in

[lru-cache.d.ts:230](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L230)

___

### off

▸ **off**(`type`, `listener`): [`LRUCache`](LRUCache.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `Function` |

#### Returns

[`LRUCache`](LRUCache.md)

#### Defined in

[lru-cache.d.ts:99](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L99)

___

### on

▸ **on**(`type`, `listener`): [`LRUCache`](LRUCache.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `Function` |

#### Returns

[`LRUCache`](LRUCache.md)

#### Defined in

[lru-cache.d.ts:98](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L98)

___

### peek

▸ **peek**(`id`): `any`

Returns the value of an item in the cache without updating its last-used time.

**`Example`**

```ts
const value = cache.peek('key1');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The key of the item to retrieve. |

#### Returns

`any`

- Returns the value of the item, or `undefined` if the item was not found in the cache or has expired.

#### Defined in

[lru-cache.d.ts:163](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L163)

___

### reset

▸ **reset**(`options?`): [`LRUCache`](LRUCache.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `number` \| [`ILRUCacheOptions`](../interfaces/ILRUCacheOptions.md) |

#### Returns

[`LRUCache`](LRUCache.md)

#### Defined in

[lru-cache.d.ts:193](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L193)

___

### set

▸ **set**(`id`, `value`, `expires?`): `any`

Adds or updates an item in the cache.

**`Example`**

```ts
cache.set('key1', 'value1', 5000); // add an item with expiration time of 5 seconds
  cache.set('key2', 'value2'); // add an item with default expiration time
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The key of the item to add or update. |
| `value` | `any` | The value of the item. |
| `expires?` | `number` | The expiration time for the item, in milliseconds. A value of 0 means no expiration time. |

#### Returns

`any`

- Returns the new value of the item, or `undefined` if the item was not found in the cache or has  expired.

#### Defined in

[lru-cache.d.ts:184](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L184)

___

### setDefaultOptions

▸ **setDefaultOptions**(`options?`): `any`

Sets the default options for LRUCache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `number` \| [`ILRUCacheOptions`](../interfaces/ILRUCacheOptions.md) | The options for LRUCache, which can be of type ILRUCacheOptions or number. If the options is a number, it represents the maxCapacity of the cache |

#### Returns

`any`

#### Defined in

[lru-cache.d.ts:225](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L225)

___

### weightOf

▸ **weightOf**(`value`, `id?`): `number`

Calculate the weight of a value. Override this method to customize capacity calculation.

**`Example`**

```ts
// Size-based capacity (in bytes)
cache.weightOf = (value) => JSON.stringify(value).length;
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | The value to calculate weight for. |
| `id?` | `any` | The id of the value. |

#### Returns

`number`

The weight of the value. Default returns 1 (count-based).

#### Defined in

[lru-cache.d.ts:128](https://github.com/snowyu/secondary-cache.js/blob/220b648/src/lru-cache.d.ts#L128)
