# shr

Simple HTTP requests for browser. "[Simple requests]" don't trigger a [CORS preflight].

[![Build Status](https://travis-ci.org/marella/shr.svg?branch=master)](https://travis-ci.org/marella/shr) [![Coverage Status](https://coveralls.io/repos/github/marella/shr/badge.svg)](https://coveralls.io/github/marella/shr)


## Installation

```bash
npm install shr --save
```


## Example

```js
import client from 'shr'

client
  .get('https://api.example.com/users')
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.log(error)
  })
```


## Documentation

To avoid [preflight requests][CORS preflight], `data` is serialized using [qs] library and sent with `Content-Type` header as `application/x-www-form-urlencoded`. `PUT`, `PATCH` and `DELETE` requests are made as `POST` requests with an additional field `_method` set to the method name which needs to be supported by the backend.

### Available Methods

```js
import { create } from 'shr'

const client = create(options)

client.request(url, options)
client.get(url, params, options)
client.post(url, data, options)
client.put(url, data, options)
client.patch(url, data, options)
client.delete(url, data, options)
```

### Options

```js
{
  baseURL: '',

  method: 'get',

  params: {},

  data: {},

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

  onDownloadProgress: () => {},

  onUploadProgress: () => {},
}
```

### Response

```js
{
  data: {},
  status: 200,
  statusText: 'OK',
}
```

### Error

```js
{
  message: '',
  response: {},
}
```


## License

[MIT][license]


[license]: /LICENSE
[Simple requests]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
[CORS preflight]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests
[qs]: https://github.com/ljharb/qs
