import { reason } from './utils'

export default function xhr(url, options = {}) {
  return new Promise(function(resolve, reject) {
    const { method, headers = {}, data } = options
    const request = options._xhr()
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
      resolve(response)
    }

    request.onerror = function() {
      reject(reason('Network request failed'))
    }

    request.ontimeout = function() {
      reject(reason('Network request failed'))
    }

    request.onabort = function() {
      reject(reason('Network request aborted'))
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

    if ('setRequestHeader' in request) {
      Object.keys(headers).forEach(name => {
        request.setRequestHeader(name, headers[name])
      })
    }

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
