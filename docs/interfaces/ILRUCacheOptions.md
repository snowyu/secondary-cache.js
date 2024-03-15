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

## Properties

### capacity

• `Optional` **capacity**: `number`

the second LRU cache max capacity size, defaults to unlimited.

#### Defined in

[lru-cache.d.ts:7](https://github.com/snowyu/secondary-cache.js/blob/83cecaf/src/lru-cache.d.ts#L7)

___

### cleanInterval

• `Optional` **cleanInterval**: `number`

clean up expired item with a specified interval(seconds) in the background.

#### Defined in

[lru-cache.d.ts:15](https://github.com/snowyu/secondary-cache.js/blob/83cecaf/src/lru-cache.d.ts#L15)

___

### expires

• `Optional` **expires**: `number`

the default expires time (millisecond), defaults to no expires time(<=0).

#### Defined in

[lru-cache.d.ts:11](https://github.com/snowyu/secondary-cache.js/blob/83cecaf/src/lru-cache.d.ts#L11)
