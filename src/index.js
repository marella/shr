import defaults from './defaults'

function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData
}

function reason(message, response) {
  const error = new TypeError(message)
  if (response) {
    error.response = response
  }
  return error
}

function request(url, options = {}) {
  return new Promise(function(resolve, reject) {
    let headers = options.headers || {}
    options = Object.assign({}, defaults, options)
    headers = Object.assign({}, defaults.headers, headers)
    const method = options.method.toUpperCase()
    let data = options.data
    if (data && options.transformRequest) {
      data = options.transformRequest(data)
    }
    if (!data || isFormData(data)) {
      delete headers['Content-Type'] // Let the browser set it
    }
    let request = options._xhr()
    request.open(method, url, true)

    /**
     * Events
     */

    request.onload = function() {
      const response = {
        data: 'response' in request ? request.response : request.responseText,
        status: request.status,
        statusText: request.statusText,
      }
      if (options.isValid(response)) {
        if (options.transformResponse) {
          response.data = options.transformResponse(response.data)
        }
        resolve(response)
      } else {
        reject(reason('Invalid response', response))
      }
      request = null
    }

    request.onerror = function() {
      reject(reason('Network request failed'))
      request = null
    }

    request.ontimeout = function() {
      reject(reason('Network request failed'))
      request = null
    }

    /**
     * Progress
     */

    if (options.onDownloadProgress) {
      request.addEventListener('progress', options.onDownloadProgress)
    }

    if (options.onUploadProgress && request.upload) {
      request.upload.addEventListener('progress', options.onUploadProgress)
    }

    /**
     * Request
     */

    request.timeout = options.timeout

    if (options.withCredentials) {
      request.withCredentials = true
    }

    if (options.responseType) {
      try {
        request.responseType = options.responseType
      } catch (e) {
        if (options.responseType !== 'json') {
          throw e
        }
      }
    }

    request.send(data || null)
  })
}

module.exports = {
  request: request,
}
