export function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData
}

export function isObject(val) {
  return val !== null && typeof val === 'object'
}

export function reason(message, response) {
  const error = new TypeError(message)
  if (response) {
    error.response = response
  }
  return error
}

export function append(data = {}, key, value) {
  if (isFormData(data)) {
    data.append(key, value)
  } else if (isObject(data)) {
    data = Object.assign({}, data, { [key]: value })
  } else {
    data += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  }
  return data
}
