const redis = require('@redis/client')

let cacheInstance
function cache () {
  if (cacheInstance === undefined) {
    if (process.env.CACHE_HOST === undefined || process.env.CACHE_PORT === undefined) {
      throw new Error('CACHE_HOST and CACHE_PORT are not set! dies!')
    }
    const config = {
      socket: {
        host: process.env.CACHE_HOST,
        port: process.env.CACHE_PORT
      }
    }
    if (process.env.CACHE_PASSWORD !== undefined) {
      config.password = process.env.CACHE_PASSWORD
    }
    cacheInstance = redis.createClient(config)
  }
  return {
    connect: async () => {
      await cacheInstance.connect()
    },
    disconnect: async () => {
      await cacheInstance.QUIT()
    },
    set: async (key, value, ttl) => {
      await cacheInstance.SET(key, value)
      typeof ttl === 'number' && cacheInstance.SETEX(key, ttl, value)
    },
    get: async (key) => {
      return (await cacheInstance.GET(key))
    },
    purge: async () => {
      await cacheInstance.FLUSHDB()
    },
    getSize: async () => {
      return (await cacheInstance.DBSIZE())
    }
  }
}

module.exports = cache
