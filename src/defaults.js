export default {
  method: 'get',

  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  },

  transformRequest(data) {
    return data
  },

  transformResponse(data) {
    return data
  },

  isValid: ({ status }) => status >= 200 && status < 300,

  timeout: 0,

  withCredentials: false,

  responseType: 'json',

  _xhr: () => new XMLHttpRequest(), // Used internally for testing.
}
