[secondary-cache](../README.md) / [Exports](../modules.md) / Cache

# Class: Cache

A cache class that extends the LRU cache and allows for fixed capacity storage.

**`Param`**

Options for configuring the cache.

**`Param`**

The maximum number of items to store in the LRU cache.

**`Param`**

The maximum age of items to store in the LRU cache (in milliseconds).

**`Param`**

The maximum stale time of items to store in the LRU cache (in milliseconds).

**`Param`**

The maximum number of items to store in the fixed capacity cache.

**`Example`**

```ts
const cache = new Cache({ max: 100, maxAge: 60000, fixedCapacity: 50 });
```

## Hierarchy

- [`LRUCache`](LRUCache.md)

  ↳ **`Cache`**

## Table of contents

### Constructors

- [constructor](Cache.md#constructor)

### Properties

- [\_cacheLRU](Cache.md#_cachelru)
- [\_lruQueue](Cache.md#_lruqueue)
- [cleanInterval](Cache.md#cleaninterval)
- [fixedCapacity](Cache.md#fixedcapacity)
- [maxAge](Cache.md#maxage)
- [maxCapacity](Cache.md#maxcapacity)
- [maxFixedCapacity](Cache.md#maxfixedcapacity)

### Methods

- [clear](Cache.md#clear)
- [clearExpires](Cache.md#clearexpires)
- [del](Cache.md#del)
- [delFixed](Cache.md#delfixed)
- [delLRU](Cache.md#dellru)
- [delListener](Cache.md#dellistener)
- [delete](Cache.md#delete)
- [deleteFixed](Cache.md#deletefixed)
- [deleteLRU](Cache.md#deletelru)
- [forEach](Cache.md#foreach)
- [forEachFixed](Cache.md#foreachfixed)
- [free](Cache.md#free)
- [freeLRU](Cache.md#freelru)
- [get](Cache.md#get)
- [getFixed](Cache.md#getfixed)
- [getLRU](Cache.md#getlru)
- [has](Cache.md#has)
- [hasFixed](Cache.md#hasfixed)
- [hasLRU](Cache.md#haslru)
- [isExist](Cache.md#isexist)
- [isExists](Cache.md#isexists)
- [isExpired](Cache.md#isexpired)
- [length](Cache.md#length)
- [off](Cache.md#off)
- [on](Cache.md#on)
- [peek](Cache.md#peek)
- [peekLRU](Cache.md#peeklru)
- [reset](Cache.md#reset)
- [set](Cache.md#set)
- [setDefaultOptions](Cache.md#setdefaultoptions)
- [setDefaultOptionsLRU](Cache.md#setdefaultoptionslru)
- [setFixed](Cache.md#setfixed)
- [setLRU](Cache.md#setlru)

## Constructors

### constructor

• **new Cache**(`options?`)

A cache class that extends the LRU cache and allows for fixed capacity storage.

**`Example`**

```ts
const cache = new Cache({ max: 100, expires: 60000, fixedCapacity: 50 });
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `number` \| [`ICacheOptions`](../interfaces/ICacheOptions.md) | optional Options object for configuring the cache or the max fixed capacity. |

#### Overrides

[LRUCache](LRUCache.md).[constructor](LRUCache.md#constructor)

#### Defined in

[cache.d.ts:45](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L45)

## Properties

### \_cacheLRU

• **\_cacheLRU**: `Object`

#### Inherited from

[LRUCache](LRUCache.md).[_cacheLRU](LRUCache.md#_cachelru)

#### Defined in

[lru-cache.d.ts:45](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L45)

___

### \_lruQueue

• **\_lruQueue**: [`LRUQueue`](LRUQueue.md)

#### Inherited from

[LRUCache](LRUCache.md).[_lruQueue](LRUCache.md#_lruqueue)

#### Defined in

[lru-cache.d.ts:46](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L46)

___

### cleanInterval

• **cleanInterval**: `number`

#### Inherited from

[LRUCache](LRUCache.md).[cleanInterval](LRUCache.md#cleaninterval)

#### Defined in

[lru-cache.d.ts:43](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L43)

___

### fixedCapacity

• **fixedCapacity**: `number`

#### Defined in

[cache.d.ts:32](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L32)

___

### maxAge

• **maxAge**: `number`

#### Inherited from

[LRUCache](LRUCache.md).[maxAge](LRUCache.md#maxage)

#### Defined in

[lru-cache.d.ts:42](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L42)

___

### maxCapacity

• **maxCapacity**: `number`

#### Inherited from

[LRUCache](LRUCache.md).[maxCapacity](LRUCache.md#maxcapacity)

#### Defined in

[lru-cache.d.ts:41](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L41)

___

### maxFixedCapacity

• **maxFixedCapacity**: `number`

#### Defined in

[cache.d.ts:33](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L33)

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

#### Inherited from

[LRUCache](LRUCache.md).[clear](LRUCache.md#clear)

#### Defined in

[lru-cache.d.ts:154](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L154)

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

#### Inherited from

[LRUCache](LRUCache.md).[clearExpires](LRUCache.md#clearexpires)

#### Defined in

[lru-cache.d.ts:180](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L180)

___

### del

▸ **del**(`id`): `boolean`

Alias for `delete()`.

**`Example`**

```ts
cache.del('key1'); // removes the item with key 'key1'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The key of the item to delete. |

#### Returns

`boolean`

- Returns `true` if the item was deleted, or `false` if the item was not found in the cache.

#### Overrides

[LRUCache](LRUCache.md).[del](LRUCache.md#del)

#### Defined in

[cache.d.ts:83](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L83)

___

### delFixed

▸ **delFixed**(`id`): `boolean`

Alias of deleteFixed

**`Example`**

```ts
const removed = cache.delFixed("someItem");
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The identifier of the item to remove. |

#### Returns

`boolean`

- True if the item was removed successfully, false otherwise.

#### Defined in

[cache.d.ts:73](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L73)

___

### delLRU

▸ **delLRU**(`id`, `isInternal?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `isInternal?` | `boolean` |

#### Returns

`boolean`

#### Defined in

[cache.d.ts:57](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L57)

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

#### Inherited from

[LRUCache](LRUCache.md).[delListener](LRUCache.md#dellistener)

#### Defined in

[lru-cache.d.ts:70](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L70)

___

### delete

▸ **delete**(`id`): `boolean`

Removes an item from the cache.

**`Example`**

```ts
const removed = cache.delete("someItem");
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The identifier of the item to remove. |

#### Returns

`boolean`

- True if the item was removed successfully, false otherwise.

#### Overrides

[LRUCache](LRUCache.md).[delete](LRUCache.md#delete)

#### Defined in

[cache.d.ts:82](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L82)

___

### deleteFixed

▸ **deleteFixed**(`id`): `boolean`

Removes an item from the fixed capacity cache.

**`Example`**

```ts
const removed = cache.deleteFixed("someItem");
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The identifier of the item to remove. |

#### Returns

`boolean`

- True if the item was removed successfully, false otherwise.

#### Defined in

[cache.d.ts:65](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L65)

___

### deleteLRU

▸ **deleteLRU**(`id`, `isInternal?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `isInternal?` | `boolean` |

#### Returns

`boolean`

#### Defined in

[cache.d.ts:56](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L56)

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

#### Inherited from

[LRUCache](LRUCache.md).[forEach](LRUCache.md#foreach)

#### Defined in

[lru-cache.d.ts:172](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L172)

___

### forEachFixed

▸ **forEachFixed**(`callback`, `thisArg?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`value`: `any`, `id`: `any`, `thisArg`: `any`) => `void` |
| `thisArg?` | `any` |

#### Returns

`void`

#### Defined in

[cache.d.ts:126](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L126)

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

#### Inherited from

[LRUCache](LRUCache.md).[free](LRUCache.md#free)

#### Defined in

[lru-cache.d.ts:163](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L163)

___

### freeLRU

▸ **freeLRU**(): `any`

Frees up the LRU memory used by the cache.

**`Example`**

```ts
cache.freeLRU();
```

#### Returns

`any`

#### Defined in

[cache.d.ts:125](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L125)

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

#### Inherited from

[LRUCache](LRUCache.md).[get](LRUCache.md#get)

#### Defined in

[lru-cache.d.ts:134](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L134)

___

### getFixed

▸ **getFixed**(`id`): `any`

Retrieves the value of an item from the fixed capacity cache.

**`Example`**

```ts
const value = cache.getFixed("someItem");
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The identifier of the item to retrieve. |

#### Returns

`any`

- The value of the item in the fixed capacity cache.

#### Defined in

[cache.d.ts:92](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L92)

___

### getLRU

▸ **getLRU**(`id`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`any`

#### Defined in

[cache.d.ts:93](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L93)

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

#### Inherited from

[LRUCache](LRUCache.md).[has](LRUCache.md#has)

#### Defined in

[lru-cache.d.ts:80](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L80)

___

### hasFixed

▸ **hasFixed**(`id`): `boolean`

Checks whether an item exists in the fixed capacity cache.

**`Example`**

```ts
const exists = cache.hasFixed("someItem");
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The identifier of the item to check. |

#### Returns

`boolean`

- True if the item exists in the fixed capacity cache, false otherwise.

#### Defined in

[cache.d.ts:54](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L54)

___

### hasLRU

▸ **hasLRU**(`id`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`boolean`

#### Defined in

[cache.d.ts:55](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L55)

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

#### Inherited from

[LRUCache](LRUCache.md).[isExist](LRUCache.md#isexist)

#### Defined in

[lru-cache.d.ts:85](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L85)

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

#### Inherited from

[LRUCache](LRUCache.md).[isExists](LRUCache.md#isexists)

#### Defined in

[lru-cache.d.ts:90](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L90)

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

#### Inherited from

[LRUCache](LRUCache.md).[isExpired](LRUCache.md#isexpired)

#### Defined in

[lru-cache.d.ts:116](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L116)

___

### length

▸ **length**(): `number`

Get the number of items in the cache.

#### Returns

`number`

The number of items in the FixedCache and LRUCache.

#### Overrides

[LRUCache](LRUCache.md).[length](LRUCache.md#length)

#### Defined in

[cache.d.ts:140](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L140)

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

#### Inherited from

[LRUCache](LRUCache.md).[off](LRUCache.md#off)

#### Defined in

[lru-cache.d.ts:72](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L72)

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

#### Inherited from

[LRUCache](LRUCache.md).[on](LRUCache.md#on)

#### Defined in

[lru-cache.d.ts:71](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L71)

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

#### Inherited from

[LRUCache](LRUCache.md).[peek](LRUCache.md#peek)

#### Defined in

[lru-cache.d.ts:125](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/lru-cache.d.ts#L125)

___

### peekLRU

▸ **peekLRU**(`id`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`any`

#### Defined in

[cache.d.ts:94](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L94)

___

### reset

▸ **reset**(`options?`): [`Cache`](Cache.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `number` \| [`ICacheOptions`](../interfaces/ICacheOptions.md) |

#### Returns

[`Cache`](Cache.md)

#### Overrides

[LRUCache](LRUCache.md).[reset](LRUCache.md#reset)

#### Defined in

[cache.d.ts:127](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L127)

___

### set

▸ **set**(`id`, `value`, `options?`): `any`

Adds or updates an item in the cache.

**`Example`**

```ts
const added = cache.set("someItem", "someValue", { fixed: true });
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The identifier of the item to add or update. |
| `value` | `any` | The value of the item to add or update. |
| `options?` | `number` \| [`ICacheSetOptions`](../interfaces/ICacheSetOptions.md) | Options for configuring the item in the cache. |

#### Returns

`any`

- True if the item was added or updated successfully, false otherwise.

#### Overrides

[LRUCache](LRUCache.md).[set](LRUCache.md#set)

#### Defined in

[cache.d.ts:118](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L118)

___

### setDefaultOptions

▸ **setDefaultOptions**(`options?`): `any`

Sets the default options for Cache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `number` \| [`ICacheOptions`](../interfaces/ICacheOptions.md) | The options for Cache, which can be of type ICacheOptions or number. If the options is a number, it represents the maxFixedCapacity and maxCapacity of the cache |

#### Returns

`any`

#### Overrides

[LRUCache](LRUCache.md).[setDefaultOptions](LRUCache.md#setdefaultoptions)

#### Defined in

[cache.d.ts:135](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L135)

___

### setDefaultOptionsLRU

▸ **setDefaultOptionsLRU**(`options?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `number` \| [`ILRUCacheOptions`](../interfaces/ILRUCacheOptions.md) |

#### Returns

`any`

#### Defined in

[cache.d.ts:128](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L128)

___

### setFixed

▸ **setFixed**(`id`, `value`): `any`

Adds or updates an item in the fixed capacity cache.

**`Example`**

```ts
const added = cache.setFixed("someItem", "someValue");
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | The identifier of the item to add or update. |
| `value` | `any` | The value of the item to add or update. |

#### Returns

`any`

- True if the item was added or updated successfully, false otherwise.

#### Defined in

[cache.d.ts:104](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L104)

___

### setLRU

▸ **setLRU**(`id`, `value`, `expires?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `value` | `any` |
| `expires?` | `number` |

#### Returns

`any`

#### Defined in

[cache.d.ts:105](https://github.com/snowyu/secondary-cache.js/blob/7d2e268/src/cache.d.ts#L105)
