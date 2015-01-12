Cache = require './src/cache'

maxCap = 10000
lruCache = Cache(maxCap)
cache = Cache()

benchmark = (run)->
  start = process.hrtime()
  sm = process.memoryUsage()
  run()
  diff = process.hrtime(start)
  em = process.memoryUsage()
  usedMem = em.rss - sm.rss
  heapTotal = em.heapTotal - sm.heapTotal
  heapUsed = em.heapUsed - sm.heapUsed
  console.log("Memory Used: " + (usedMem/1024) + "KB")
  console.log("Heap Total: " + (heapTotal/1024) + "KB")
  console.log("Heap Used: " + (heapUsed/1024) + "KB")
  console.log("Time Cost: " + (diff[0]*1e3+diff[1]/1e6) + " ms\n")

console.log("fixed Cache:")

benchmark ->
  console.log("------set benchmark---------")
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
  console.log("------set benchmark---------")
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
