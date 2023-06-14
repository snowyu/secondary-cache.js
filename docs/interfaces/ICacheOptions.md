[secondary-cache](../README.md) / [Exports](../modules.md) / ICacheOptions

# Interface: ICacheOptions

## Hierarchy

- [`ILRUCacheOptions`](ILRUCacheOptions.md)

  ↳ **`ICacheOptions`**

## Table of contents

### Properties

- [capacity](ICacheOptions.md#capacity)
- [cleanInterval](ICacheOptions.md#cleaninterval)
- [expires](ICacheOptions.md#expires)
- [fixedCapacity](ICacheOptions.md#fixedcapacity)

## Properties

### capacity

• `Optional` **capacity**: `number`

the second LRU cache max capacity size, defaults to unlimited.

#### Inherited from

[ILRUCacheOptions](ILRUCacheOptions.md).[capacity](ILRUCacheOptions.md#capacity)

#### Defined in

[lru-cache.d.ts:7](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-cache.d.ts#L7)

___

### cleanInterval

• `Optional` **cleanInterval**: `number`

clean up expired item with a specified interval(seconds) in the background.

#### Inherited from

[ILRUCacheOptions](ILRUCacheOptions.md).[cleanInterval](ILRUCacheOptions.md#cleaninterval)

#### Defined in

[lru-cache.d.ts:15](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-cache.d.ts#L15)

___

### expires

• `Optional` **expires**: `number`

the default expires time (millisecond), defaults to no expires time(<=0).

#### Inherited from

[ILRUCacheOptions](ILRUCacheOptions.md).[expires](ILRUCacheOptions.md#expires)

#### Defined in

[lru-cache.d.ts:11](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/lru-cache.d.ts#L11)

___

### fixedCapacity

• `Optional` **fixedCapacity**: `number`

the fixed cache max capacity size, defaults to unlimit.

#### Defined in

[cache.d.ts:7](https://github.com/snowyu/secondary-cache.js/blob/6b65a61/src/cache.d.ts#L7)
