import request from './xhr'

describe('xhr', () => {
  const mock = () => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
  })
  const url = 'foo'
  const method = 'bar'
  const subject = (options = {}, xhr) => {
    xhr = xhr || mock()
    options = Object.assign(
      {
        method,
        _xhr: () => xhr,
      },
      options
    )
    const promise = request(url, options)
    return { xhr, promise }
  }

  it('should call open and send', () => {
    const { xhr } = subject()
    expect(xhr.open.mock.calls.length).toBe(1)
    expect(xhr.open.mock.calls[0]).toEqual([method, url, true])
    expect(xhr.send.mock.calls.length).toBe(1)
    expect(xhr.send.mock.calls[0]).toEqual([null])
  })

  it('should set headers', () => {
    const headers = {
      name1: 'value1',
      name2: 'value2',
    }
    const { xhr } = subject({ headers })
    expect(xhr.setRequestHeader.mock.calls.length).toBe(2)
    expect(xhr.setRequestHeader.mock.calls[0]).toEqual(['name1', 'value1'])
    expect(xhr.setRequestHeader.mock.calls[1]).toEqual(['name2', 'value2'])
  })

  it('should set timeout', () => {
    const timeout = 1234
    const { xhr } = subject({ timeout })
    expect(xhr.timeout).toBe(timeout)
  })

  it('should set withCredentials', () => {
    const withCredentials = true
    const { xhr } = subject({ withCredentials })
    expect(xhr.withCredentials).toBe(withCredentials)
  })

  describe('responseType', () => {
    const error = new TypeError('some message')
    const mockWithError = () => {
      const xhr = mock()
      Object.defineProperty(xhr, 'responseType', {
        set: () => {
          throw error
        },
      })
      return xhr
    }

    it('should set responseType', () => {
      const responseType = 'json'
      const { xhr } = subject({ responseType })
      expect(xhr.responseType).toBe(responseType)
    })

    it('should not throw error when not setting responseType', () => {
      const mock = mockWithError()
      const { xhr } = subject(undefined, mock)
      expect(xhr).toBe(mock)
      expect(xhr.open.mock.calls.length).toBe(1)
      expect(xhr.send.mock.calls.length).toBe(1)
      expect(xhr.responseType).toBeUndefined()
    })

    it('should throw error when setting responseType', done => {
      const mock = mockWithError()
      const { xhr, promise } = subject({ responseType: 'text' }, mock)
      expect(xhr).toBe(mock)
      expect(xhr.open.mock.calls.length).toBe(1)
      expect(xhr.send.mock.calls.length).toBe(0)
      expect(xhr.responseType).toBeUndefined()
      promise.catch(e => {
        expect(e).toBe(error)
        done()
      })
    })

    it('should not throw error when setting responseType as json', () => {
      const mock = mockWithError()
      const { xhr, promise } = subject({ responseType: 'json' }, mock)
      expect(xhr).toBe(mock)
      expect(xhr.open.mock.calls.length).toBe(1)
      expect(xhr.send.mock.calls.length).toBe(1)
      expect(xhr.responseType).toBeUndefined()
    })
  })
})
