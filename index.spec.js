const cache = require('./index')()

describe('Cash', () => {
  afterAll(async () => {
    await cache.close()
  })

  it('purges', async () => {
    await cache.purge()
    const getSizeResult = await cache.getSize()
    expect(getSizeResult).toBe(0)
  })

  it('sets/gets one value', async () => {
    await cache.set('test-1-x0', '0')
    const getResult = await cache.get('test-1-x0')
    expect(getResult).toBe('0')
  })

  it('gets NULL for a value that was never set', async () => {
    await cache.set('test-2-x0', '0')
    const getResult = await cache.get('test-2-x1')
    expect(getResult).toBe(null)
  })

  it('sets/gets many values', async () => {
    await cache.setManyToOneValue(['test-3-x1', 'test-3-x2'], '0')
    const getManyResult = await cache.getMany(['test-3-x1', 'test-3-x2', 'test-3-x3'])
    expect(Array.isArray(getManyResult)).toBe(true)
    expect(getManyResult.length).toBe(3)
    expect(getManyResult[0]).toBe('0')
    expect(getManyResult[1]).toBe('0')
    expect(getManyResult[2]).toBe(null)
  })
})
