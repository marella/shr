import { create } from '.'
import defaults from './defaults'

describe('shr', () => {
  const url = 'foo'
  const subject = options => {
    const adapter = jest.fn()
    adapter.mockReturnValue(new Promise(() => {}))
    const client = create(options)
    client.setAdapter(adapter)
    return { client, adapter }
  }

  it('should add base url', () => {
    const baseURL = 'https://api.example.com/'
    const { client, adapter } = subject({ baseURL })

    client.request(url)
    expect(adapter.mock.calls.length).toBe(1)
    expect(adapter.mock.calls[0][0]).toBe(baseURL + url)
  })

  it('should transform params', () => {
    const params = {
      key1: 'value1',
      key2: 'value2',
    }
    const { client, adapter } = subject()
    let options

    client.get(url, params)
    expect(adapter.mock.calls.length).toBe(1)
    expect(adapter.mock.calls[0][0]).toBe(url + '?key1=value1&key2=value2')
    options = adapter.mock.calls[0][1]
    expect(options.method).toBe('GET')
    expect(options.data).toBeUndefined()
    expect(options.headers['Content-Type']).toBeUndefined()

    client.get(url + '?key3=value3', params)
    expect(adapter.mock.calls.length).toBe(2)
    expect(adapter.mock.calls[1][0]).toBe(
      url + '?key3=value3&key1=value1&key2=value2'
    )
    options = adapter.mock.calls[1][1]
    expect(options.method).toBe('GET')
    expect(options.data).toBeUndefined()
    expect(options.headers['Content-Type']).toBeUndefined()
  })

  it('should transform data', () => {
    const data = {
      key1: 'value1',
      key2: 'value2',
    }
    const { client, adapter } = subject()
    client.post(url, data)
    expect(adapter.mock.calls.length).toBe(1)
    expect(adapter.mock.calls[0][0]).toBe(url)
    const options = adapter.mock.calls[0][1]
    expect(options.method).toBe('POST')
    expect(options.data).toBe('key1=value1&key2=value2')
    expect(options.headers['Content-Type']).toBe(
      defaults.headers['Content-Type']
    )
  })
})
