import { epoch } from '$lib/datetime'

type CacheUrl = string
type Seconds = number

let _cache: Record<CacheUrl, unknown> = {}
let _lifetimes: Record<CacheUrl, Seconds> = {}

let intervalHandle: number | null = null

function cleanup() {
  const urls = Object.keys(_lifetimes)
  if (urls.length > 0) {
    const now = epoch()
    for (const url of urls) {
      if (_lifetimes[url] < now) {
        delete _cache[url]
        delete _lifetimes[url]
      }
    }
  } else {
    if (intervalHandle !== null) clearInterval(intervalHandle)
    intervalHandle = null
  }
}

export default {
  get<T>(requestUrl: string): T {
    if (this.has(requestUrl)) return _cache[requestUrl] as T
    else throw new Error(`cache item "${requestUrl}" not found`)
  },

  has(requestUrl: string) {
    return Object.prototype.hasOwnProperty.call(_cache, requestUrl)
  },

  set<T>(requestUrl: string, responseData: T, cacheLifetime: Seconds = 10 * 60) {
    //todo: cache lifetime from env var
    _cache[requestUrl] = responseData
    _lifetimes[requestUrl] = epoch() + cacheLifetime
    if (intervalHandle === null) intervalHandle = setInterval(cleanup, 1000) as any
    return responseData
  },

  clear() {
    _cache = {}
    _lifetimes = {}
  }
}
