import {getConfig} from "./sysconfig";

export async function queryBgImgUrl(searchTerm: string) {
    const apiKey = (await getConfig()).unsplash_api_key
    if (!apiKey)
        throw new Error(('unsplash error: no api key given'))
    const search = new URLSearchParams({
        client_id: apiKey,
        orientation: 'landscape', // todo: mobile phone
        query: searchTerm
    })
    const res = await fetch('https://api.unsplash.com/photos/random?' + search.toString())
    if (res.status === 200) {
        const data = await res.json()
        return data.urls.full
    } else {
        throw new Error('unsplash error: ' + (await res.text()))
    }
}
