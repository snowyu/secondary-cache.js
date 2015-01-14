Cache = require './lib/cache'

maxCap = 10000
lruCache = Cache(maxCap)
cache = Cache()

benchmark = (run)->
  start = process.hrtime()
  sm = process.memoryUsage()
  run()
  diff = process.hrtime(start)
  em = process.memoryUsage()
  usedMem = (em.rss - sm.rss) / 1024
  heapTotal = (em.heapTotal - sm.heapTotal) / 1024
  heapUsed = (em.heapUsed - sm.heapUsed) / 1024
  time = diff[0]*1e3 + diff[1]/1e6
  console.log("Memory Used: " + (usedMem) + "KB")
  console.log("Heap Total: " + (heapTotal) + "KB")
  console.log("Heap Used: " + (heapUsed) + "KB")
  console.log("Time Cost: " + (time) + " ms\n")

console.log("fixed Cache:")

benchmark ->
  console.log("------add benchmark---------")
  for i in [0...maxCap]
    cache.setFixed('test' + i, i)
  return

benchmark ->
  console.log("------update benchmark---------")
  for i in [0...maxCap]
    cache.setFixed('test' + i, i)
  return

benchmark ->
  console.log("------get benchmark---------")
  for i in [0...maxCap]
    cache.get('test' + i)
  return

benchmark ->
  console.log("-----del benchmark---------")
  for i in [0...maxCap]
    cache.del('test' + i)
  return

benchmark ->
  console.log("------clear benchmark---------")
  cache.clear()
  return

console.log("LRU Cache:")

benchmark ->
  console.log("------add benchmark---------")
  for i in [0...maxCap]
    lruCache.set('test' + i, i)
  return

benchmark ->
  console.log("------update benchmark---------")
  for i in [0...maxCap]
    lruCache.set('test' + i, i)
  return

benchmark ->
  console.log("------get benchmark---------")
  for i in [0...maxCap]
    lruCache.get('test' + i)
  return

benchmark ->
  console.log("-----del benchmark---------")
  for i in [0...maxCap]
    cache.del('test' + i)
  return

benchmark ->
  console.log("------clear benchmark---------")
  lruCache.clear()
  return
