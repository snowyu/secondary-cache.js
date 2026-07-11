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

[lru-cache.d.ts:99](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L99)

## Properties

### \_cacheLRU

• **\_cacheLRU**: `Object`

#### Defined in

[lru-cache.d.ts:66](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L66)

___

### \_lruQueue

• **\_lruQueue**: [`LRUQueue`](LRUQueue.md)

#### Defined in

[lru-cache.d.ts:68](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L68)

___

### \_totalWeight

• **\_totalWeight**: `number`

#### Defined in

[lru-cache.d.ts:70](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L70)

___

### cleanInterval

• **cleanInterval**: `number`

#### Defined in

[lru-cache.d.ts:63](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L63)

___

### maxAge

• **maxAge**: `number`

#### Defined in

[lru-cache.d.ts:62](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L62)

___

### maxCapacity

• **maxCapacity**: `number`

#### Defined in

[lru-cache.d.ts:60](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L60)

___

### maxWeight

• **maxWeight**: `number`

#### Defined in

[lru-cache.d.ts:61](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L61)

___

### totalWeight

• `Readonly` **totalWeight**: `number`

The total weight of all items in the cache (read-only).
Only meaningful when using weight-based capacity (maxWeight > 0).

#### Defined in

[lru-cache.d.ts:76](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L76)

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

[lru-cache.d.ts:195](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L195)

___

### clearExpires

▸ **clearExpires**(): `void`

Deletes all expires items from the cache.

**`Example`**

```ts
cache.clearExpires(); // removes all expires items from the cache
```

#### Returns

`void`

- Returns the cache instance.

#### Defined in

[lru-cache.d.ts:221](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L221)

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

[lru-cache.d.ts:151](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L151)

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

[lru-cache.d.ts:100](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L100)

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

[lru-cache.d.ts:141](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L141)

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

[lru-cache.d.ts:213](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L213)

___

### free

▸ **free**(): `void`

Frees up the memory used by the cache.

**`Example`**

```ts
cache.free(); // frees up the memory used by the cache
```

#### Returns

`void`

- Returns nothing.

#### Defined in

[lru-cache.d.ts:204](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L204)

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

[lru-cache.d.ts:175](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L175)

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

[lru-cache.d.ts:110](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L110)

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

[lru-cache.d.ts:115](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L115)

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

[lru-cache.d.ts:120](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L120)

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

[lru-cache.d.ts:157](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L157)

___

### length

▸ **length**(): `number`

Get the number of items in the cache.

#### Returns

`number`

The number of items in the LRUCache.

#### Defined in

[lru-cache.d.ts:233](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L233)

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

[lru-cache.d.ts:102](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L102)

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

[lru-cache.d.ts:101](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L101)

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

[lru-cache.d.ts:166](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L166)

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

[lru-cache.d.ts:196](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L196)

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

[lru-cache.d.ts:187](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L187)

___

### setDefaultOptions

▸ **setDefaultOptions**(`options?`): `void`

Sets the default options for LRUCache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `number` \| [`ILRUCacheOptions`](../interfaces/ILRUCacheOptions.md) | The options for LRUCache, which can be of type ILRUCacheOptions or number. If the options is a number, it represents the maxCapacity of the cache |

#### Returns

`void`

#### Defined in

[lru-cache.d.ts:228](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L228)

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

[lru-cache.d.ts:131](https://github.com/snowyu/secondary-cache.js/blob/91d49dd/src/lru-cache.d.ts#L131)
