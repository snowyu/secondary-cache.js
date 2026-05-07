[secondary-cache](../README.md) / [Exports](../modules.md) / ILRUCacheOptions

# Interface: ILRUCacheOptions

## Hierarchy

- **`ILRUCacheOptions`**

  ↳ [`ICacheOptions`](ICacheOptions.md)

## Table of contents

### Properties

- [capacity](ILRUCacheOptions.md#capacity)
- [cleanInterval](ILRUCacheOptions.md#cleaninterval)
- [expires](ILRUCacheOptions.md#expires)
- [maxWeight](ILRUCacheOptions.md#maxweight)
- [weightOf](ILRUCacheOptions.md#weightof)

## Properties

### capacity

• `Optional` **capacity**: `number`

the second LRU cache max capacity size, defaults to unlimited.

#### Defined in

[lru-cache.d.ts:7](https://github.com/snowyu/secondary-cache.js/blob/8685512/src/lru-cache.d.ts#L7)

___

### cleanInterval

• `Optional` **cleanInterval**: `number`

clean up expired item with a specified interval(seconds) in the background.

#### Defined in

[lru-cache.d.ts:20](https://github.com/snowyu/secondary-cache.js/blob/8685512/src/lru-cache.d.ts#L20)

___

### expires

• `Optional` **expires**: `number`

the default expires time (millisecond), defaults to no expires time(<=0).

#### Defined in

[lru-cache.d.ts:16](https://github.com/snowyu/secondary-cache.js/blob/8685512/src/lru-cache.d.ts#L16)

___

### maxWeight

• `Optional` **maxWeight**: `number`

the maximum weight of items the cache can hold. 0 means no limit.
Used with weightOf function for custom capacity control (e.g., by size).

#### Defined in

[lru-cache.d.ts:12](https://github.com/snowyu/secondary-cache.js/blob/8685512/src/lru-cache.d.ts#L12)

___

### weightOf

• `Optional` **weightOf**: (`value`: `any`, `id?`: `any`) => `number`

#### Type declaration

▸ (`value`, `id?`): `number`

Custom function to calculate the weight of a value.

**`Example`**

```ts
// Size-based capacity (in bytes)
weightOf: (value) => JSON.stringify(value).length
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | The value to calculate weight for. |
| `id?` | `any` | The id of the value. |

##### Returns

`number`

The weight of the value. Return 1 for count-based capacity (default).

#### Defined in

[lru-cache.d.ts:30](https://github.com/snowyu/secondary-cache.js/blob/8685512/src/lru-cache.d.ts#L30)
