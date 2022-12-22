import {getConfig} from "./sysconfig";
import {fetchTimeout} from "$lib/fetch";
import path from "path";
import {cache} from "$lib/server/httpcache";
import {chooseRandom} from "$lib/random";

export async function queryBgImgUrlReddit(subreddits: string, timeout?: number) {
    const fetchPosts = async (subreddits: string[]) => {
        const url = 'https://api.reddit.com/r/' + path.basename(subreddits.join('+')) + '/.json?limit=100'
        if (cache(url)) return cache(url)
        const response = await fetchTimeout(url, {
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
            timeout
        })
        const data = await response.json()
        return cache(url, data.data.children.filter(
            post => !post.data.is_video && !post.data.stickied && post.data.url && post.data.thumbnail && ['i.imgur.com', 'i.redd.it'].includes(post.data.domain)
        ).filter(post => {
            const src = post.data.preview?.images[0].source
            if (src) {
                const {width, height} = src
                return height > 800 && width > 1000 && width / height > 1.1
            } else return false
        }).map(post => post.data.url))
    }
    return chooseRandom(await fetchPosts(subreddits.trim().split(/\s*,\s*/)))

}

export async function queryBgImgUrlUnsplash(searchTerm: string, timeout?: number) {

    const apiKey = (await getConfig()).unsplash_api_key
    if (!apiKey)
        throw new Error(('unsplash error: no api key given'))
    const search = new URLSearchParams({
        client_id: apiKey,
        orientation: 'landscape',
        query: searchTerm
    })
    const res = await fetchTimeout('https://api.unsplash.com/photos/random?' + search.toString(), {timeout})
    if (res.status === 200) {
        const data = await res.json()
        return data.urls.full
    } else {
        throw new Error('unsplash error: ' + (await res.text()))
    }
}
