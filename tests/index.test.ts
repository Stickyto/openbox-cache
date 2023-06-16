import { Cache } from '@src/cache'

const mockCreateClient = jest.fn()

const mockConnect = jest.fn()
const mockQuit = jest.fn()
const mockSet = jest.fn()
const mockSetEx = jest.fn()
const mockGet = jest.fn()
const mockFlushDb = jest.fn()
const mockDbSize = jest.fn()

mockCreateClient.mockImplementation(() => ({
  connect: mockConnect,
  QUIT: mockQuit,
  SET: mockSet,
  SETEX: mockSetEx,
  GET: mockGet,
  FLUSHDB: mockFlushDb,
  DBSIZE: mockDbSize,
}))

jest.mock('@redis/client', () => ({
  createClient: () => mockCreateClient(),
}))

describe('Cache Tests', () => {
  beforeEach(() => {
    process.env.CACHE_HOST = 'localhost'
    process.env.CACHE_PORT = '8080'
    jest.clearAllMocks()
  })

  it('should throw an error if CACHE_HOST or CACHE_PORT are not set', () => {
    process.env = {}
    expect(() => new Cache()).toThrow(
      'CACHE_HOST and CACHE_PORT must be defined!',
    )
  })

  it('should create client only once for multiple instances', async () => {
    new Cache()
    new Cache()

    expect(mockCreateClient).toHaveBeenCalledTimes(1)
  })

  it('should connect', async () => {
    const cache = new Cache()
    await cache.connect()
    expect(mockConnect).toHaveBeenCalled()
  })

  it('should disconnect', async () => {
    const cache = new Cache()
    await cache.disconnect()
    expect(mockQuit).toHaveBeenCalled()
  })

  it('should use SETEX if ttl is a number', async () => {
    const cache = new Cache()
    const key = 'test-key'
    const value = 'test-value'
    const ttl = 60

    await cache.set(key, value, ttl)

    expect(mockSet).not.toHaveBeenCalled()
    expect(mockSetEx).toHaveBeenCalledWith(key, ttl, value)
  })

  it('should only use SET if ttl is not a number', async () => {
    const cache = new Cache()
    const key = 'test-key'
    const value = 'test-value'

    await cache.set(key, value)

    expect(mockSet).toHaveBeenCalledWith(key, value)
    expect(mockSetEx).not.toHaveBeenCalled()
  })

  it('should get a value', async () => {
    const cache = new Cache()
    const key = 'test-key'
    const value = 'value'

    mockGet.mockResolvedValue(value)

    const result = await cache.get(key)

    expect(mockGet).toHaveBeenCalledWith(key)
    expect(result).toBe(value)
  })

  it('should purge', async () => {
    const cache = new Cache()
    await cache.purge()
    expect(mockFlushDb).toHaveBeenCalled()
  })

  it('should get size', async () => {
    const cache = new Cache()
    const value = 1

    mockDbSize.mockResolvedValue(value)
    const size = await cache.getSize()

    expect(mockDbSize).toHaveBeenCalled()
    expect(size).toBe(value)
  })
})
