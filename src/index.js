import qs from 'qs'

import { isFormData, isObject, reason, append } from './utils'
import defaults from './defaults'
import xhr from './xhr'

function transformData(data, options) {
  if (!data) {
    return data
  }
  if (isFormData(data)) {
    return data
  }
  if (isObject(data)) {
    return qs.stringify(data)
  }
  return data
}

function request(url, options = {}, adapter = xhr) {
  const { baseURL = '' } = options
  url = baseURL + url
  const headers = Object.assign({}, defaults.headers, options.headers)
  options = Object.assign({}, defaults, options, { headers })
  options.method = options.method.toUpperCase()
  if (options.transformRequest) {
    if (options.method === 'GET') {
      options.params = options.transformRequest(options.params, options)
    } else {
      options.data = options.transformRequest(options.data, options)
    }
  }
  options.data = transformData(options.data, options)
  if (!options.data || isFormData(options.data)) {
    delete options.headers['Content-Type'] // Let the browser set it
  }
  if (options.params) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + qs.stringify(options.params)
  }

  return adapter(url, options).then(response => {
    if (options.isValid(response)) {
      if (options.transformResponse) {
        response.data = options.transformResponse(response.data, options)
      }
      return response
    } else {
      throw reason('Invalid response', response)
    }
  })
}

class Client {
  constructor(options) {
    this.options = options
    this.adapter = xhr
    ;['put', 'patch', 'delete'].forEach(method => {
      this[method] = (url, data, options = {}) => {
        data = append(data, '_method', method)
        return this.post(url, data, options)
      }
    })
  }

  request(url, options = {}) {
    options = Object.assign({}, this.options, options)
    return request(url, options, this.adapter)
  }

  get(url, params, options = {}) {
    options.method = 'get'
    options.params = params
    return this.request(url, options)
  }

  post(url, data, options = {}) {
    options.method = 'post'
    options.data = data
    return this.request(url, options)
  }

  setAdapter(adapter) {
    this.adapter = adapter
    return this
  }
}

export function create(options = {}) {
  return new Client(options)
}

export default create()

export { append }
