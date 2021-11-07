const redis = require('redis')

let cacheInstance
function cache () {
  if (cacheInstance === undefined) {
    if (process.env.CACHE_HOST === undefined || process.env.CACHE_PORT === undefined) {
      throw new Error('CACHE_HOST and CACHE_PORT are not set! dies!')
    }
    const config = {
      host: process.env.CACHE_HOST,
      port: process.env.CACHE_PORT
    }
    if (process.env.CACHE_PASSWORD !== undefined) {
      config.password = process.env.CACHE_PASSWORD
    }
    cacheInstance = redis.createClient(config)
  }
  return {
    set: (key, value, ttl) => {
      return new Promise((resolve, reject) => {
        cacheInstance.set(key, value, (error) => (error ? reject(error) : () => {
          resolve()
          typeof ttl === 'number' && cacheInstance.setex(key, ttl, value)
        })())
      })
    },
    get: (key) => {
      return new Promise((resolve, reject) => {
        cacheInstance.get(key, (error, value) => (error ? reject(error) : resolve(value)))
      })
    },
    setManyToOneValue: (keys, value) => {
      if (keys.length === 0) return Promise.resolve('redis setManyToOneValue empty array but ok')
      const values = []
      keys.forEach(key => {
        values.push(key)
        values.push(value)
      })
      return new Promise((resolve, reject) => {
        cacheInstance.mset(...values, (error, values) => (error ? reject(new Error('redis setManyToOneValue -> fucked')) : resolve(values)))
      })
    },
    getMany: (keys) => {
      if (keys.length === 0) return Promise.resolve('redis getMany empty array but ok')
      return new Promise((resolve, reject) => {
        cacheInstance.mget(keys, (error, values) => (error ? reject(new Error('redis getMany -> fucked')) : resolve(values)))
      })
    },
    purge: () => {
      return new Promise((resolve, reject) => {
        cacheInstance.flushdb((error, values) => (error ? reject(new Error('redis purge -> fucked')) : resolve(true)))
      })
    },
    getSize: () => {
      return new Promise((resolve, reject) => {
        cacheInstance.dbsize((error, value) => (error ? reject(new Error('redis purge -> fucked')) : resolve(value)))
      })
    },
    close: () => {
      return new Promise((resolve, reject) => {
        cacheInstance.quit((error) => (error ? reject(new Error('couldnt quit')) : resolve()))
      })
    }
  }
}

module.exports = cache
