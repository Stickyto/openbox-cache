import { createClient, RedisClientOptions } from '@redis/client'

export class Cache {
  private static cacheInstance

  constructor() {
    if (!Cache.cacheInstance) {
      const { CACHE_HOST, CACHE_PORT, CACHE_PASSWORD } = process.env

      if (!CACHE_HOST || !CACHE_PORT) {
        throw new Error('CACHE_HOST and CACHE_PORT must be defined!')
      }

      const config: RedisClientOptions = {
        socket: {
          host: CACHE_HOST,
          port: Number(CACHE_PORT),
        },
        password: CACHE_PASSWORD,
      }

      Cache.cacheInstance = createClient(config)
    }
  }

  public connect = async (): Promise<void> => {
    await Cache.cacheInstance.connect()
  }

  public disconnect = async (): Promise<void> => {
    await Cache.cacheInstance.QUIT()
  }

  public set = async (
    key: string,
    value: string,
    ttl?: number,
  ): Promise<void> => {
    if (typeof ttl === 'number') {
      await Cache.cacheInstance.SETEX(key, ttl, value)
    } else {
      await Cache.cacheInstance.SET(key, value)
    }
  }

  public get = async (key: string): Promise<string | null> => {
    return await Cache.cacheInstance.GET(key)
  }

  public purge = async (): Promise<void> => {
    await Cache.cacheInstance.FLUSHDB()
  }

  public getSize = async (): Promise<number> => {
    return await Cache.cacheInstance.DBSIZE()
  }
}
