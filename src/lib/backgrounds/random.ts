import { sysConfig } from '$lib/server/sysconfig'
import { fetchTimeout } from '$lib/server/fetch'
import path from 'path'
import cache from '$lib/server/httpcache'
import { chooseRandom } from '$lib/server/random'
import { readdir } from 'node:fs/promises'
import { isDir } from '$lib/server/fs'

export async function queryBgImgUrlReddit({ subreddits, failfast }: { subreddits: string; failfast: boolean }) {
  const fetchPosts = async (subreddits: string[]) => {
    const url = 'https://api.reddit.com/r/' + path.basename(subreddits.join('+')) + '/.json?limit=100'
    if (cache.has(url)) return cache.get<string[]>(url)
    const response = await fetchTimeout(url, { credentials: 'omit', referrerPolicy: 'no-referrer', failfast })
    if (!response.ok) throw new Error(await response.text())
    const imgPosts = (await response.json()).data.children.filter(
      (post: any) =>
        !post.data.is_video && !post.data.stickied && post.data.url && post.data.thumbnail && ['i.imgur.com', 'i.redd.it'].includes(post.data.domain)
    )
    let imgs: string[] = imgPosts
      .filter((post: any) => {
        const src = post.data.preview?.images[0]?.source
        if (src) {
          const { width, height } = src
          return height > 800 && width > 1000 && width / height > 1.1
        } else return false
      })
      .map((post: any) => post.data.url)
    if (imgs.length === 0) imgs = imgPosts.filter((post: any) => !!post.data.preview?.images[0]?.source).map((post: any) => post.data.url)
    return cache.set(url, imgs)
  }
  return chooseRandom(await fetchPosts(subreddits.trim().split(/\s*,\s*/))) as string
}

export async function queryBgImgUrlUnsplash({ searchTerm, failfast }: { searchTerm: string; failfast: boolean }) {
  const apiKey = sysConfig.unsplash_api_key
  if (!apiKey) throw new Error('unsplash error: no api key given')
  const search = new URLSearchParams({
    client_id: apiKey,
    orientation: 'landscape',
    query: searchTerm
  })
  const res = await fetchTimeout('https://api.unsplash.com/photos/random?' + search.toString(), { failfast })
  if (res.status === 200) {
    const data = await res.json()
    return data.urls.full
  } else {
    throw new Error('unsplash error: ' + (await res.text()))
  }
}

export async function queryBgImgUrlLocal() {
  if (await isDir('/data/wallpaper/')) {
    const entries = await readdir('/data/wallpaper/', { recursive: true, withFileTypes: true })
    const files = entries.filter(e => e.isFile()).map(e => path.join(e.path, e.name).replace(/^\/data\/wallpaper\//, ''))
    if (files.length > 0) return '/background/wallpaper/' + chooseRandom(files)
  }
  return null
}

export async function hasLocalBgImgs() {
  return (await isDir('/data/wallpaper/')) && (await readdir('/data/wallpaper/', { recursive: true, withFileTypes: true })).some(e => e.isFile())
}
