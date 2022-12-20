import {epoch} from "$lib/datetime";

type CacheUrl = string
type Seconds = number

let _cache: Record<CacheUrl, any> = {}
let _lifetimes: Record<CacheUrl, number> = {}

let intervalHandle = null

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
        clearInterval(intervalHandle)
        intervalHandle = null
    }
}

export function cache<T>(requestUrl: string, responseData: T = undefined, cacheLifetime: Seconds = 10 * 60): T | undefined {
    if (responseData !== undefined) {
        _cache[requestUrl] = responseData
        _lifetimes[requestUrl] = epoch() + cacheLifetime
        if (intervalHandle === null)
            intervalHandle = setInterval(cleanup, 1000)
        return responseData
    } else {
        if (_cache.hasOwnProperty(requestUrl))
            return _cache[requestUrl]
        else
            return undefined
    }
}

export function clearCache() {
    _cache = {}
    _lifetimes = {}
}
