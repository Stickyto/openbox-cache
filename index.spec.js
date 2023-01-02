const cache = require('./index')()

beforeAll(async () => {
  await cache.connect()
})

afterAll(async () => {
  await cache.disconnect()
})

it('sets/gets one value', async () => {
  await cache.set('test-1-x0', '100', 10)
  const getResult = await cache.get('test-1-x0')
  expect(getResult).toBe('100')
})

it('purges', async () => {
  const getSizeResult1 = await cache.getSize()
  expect(getSizeResult1).toBeGreaterThanOrEqual(1)
  await cache.purge()
  const getSizeResult2 = await cache.getSize()
  expect(getSizeResult2).toBe(0)
})

it('gets NULL for a value that was never set', async () => {
  await cache.set('test-2-x0', '0')
  const getResult = await cache.get('test-2-x1')
  expect(getResult).toBe(null)
})
