import { epoch } from '$lib/utils'
import { sysConfig } from './sysconfig'

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

  set<T>(requestUrl: string, responseData: T) {
    if (sysConfig.httpcache_ttl) {
      _cache[requestUrl] = responseData
      _lifetimes[requestUrl] = epoch() + sysConfig.httpcache_ttl * 60
      if (intervalHandle === null) intervalHandle = setInterval(cleanup, 1_000) as any
    }
    return responseData
  },

  clear() {
    _cache = {}
    _lifetimes = {}
  }
}
