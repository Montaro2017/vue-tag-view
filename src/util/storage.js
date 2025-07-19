export default {
  get: (key) => {
    let json = localStorage.getItem(key)
    if (json == null) {
      return null
    }
    return JSON.parse(json)
  },
  set: (key, value) => {
    let json = JSON.stringify(value)
    localStorage.setItem(key, json)
  },
  clear: (key) => {
    localStorage.removeItem(key)
  }
}
