import { getSysConfig } from './sysconfig'
import { fetchTimeout } from '$lib/fetch'
import path from 'path'
import cache from '$lib/server/httpcache'
import { chooseRandom } from '$lib/random'
import { getParticles } from '$lib/particles'
import { epoch } from '$lib/datetime'
import type { Cookies } from '@sveltejs/kit'

export async function queryBgImgUrlReddit(subreddits: string, timeout?: number) {
  const fetchPosts = async (subreddits: string[]) => {
    const url = 'https://api.reddit.com/r/' + path.basename(subreddits.join('+')) + '/.json?limit=100'
    if (cache.has(url)) return cache.get(url)
    const response = await fetchTimeout(url, {
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      timeout
    })
    if (!response.ok) throw new Error(await response.text())
    const imgPosts = (await response.json()).data.children.filter(
      (post: any) =>
        !post.data.is_video && !post.data.stickied && post.data.url && post.data.thumbnail && ['i.imgur.com', 'i.redd.it'].includes(post.data.domain)
    )
    let imgs = imgPosts
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
  return chooseRandom(await fetchPosts(subreddits.trim().split(/\s*,\s*/)))
}

export async function queryBgImgUrlUnsplash(searchTerm: string, timeout?: number) {
  const apiKey = (await getSysConfig()).unsplash_api_key
  if (!apiKey) throw new Error('unsplash error: no api key given')
  const search = new URLSearchParams({
    client_id: apiKey,
    orientation: 'landscape',
    query: searchTerm
  })
  const res = await fetchTimeout('https://api.unsplash.com/photos/random?' + search.toString(), { timeout })
  if (res.status === 200) {
    const data = await res.json()
    return data.urls.full
  } else {
    throw new Error('unsplash error: ' + (await res.text()))
  }
}

export async function generateCurrentBgConfig({
  currentBgImgUrl,
  userConfig,
  timeout
}: {
  currentBgImgUrl?: string
  userConfig: UserConfig
  timeout?: number
}) {
  const bgCfg: BackgroundConfig = userConfig.backgrounds.find(bgCfg => bgCfg.selected) as BackgroundConfig
  const particlesJob = bgCfg.particles ? getParticles(bgCfg.particles) : null

  let bgImg = null
  if (!currentBgImgUrl) {
    let bgImgUrlJob = null

    if (bgCfg.background === 'random') {
      try {
        if (bgCfg.random_image.provider === 'unsplash') bgImgUrlJob = queryBgImgUrlUnsplash(bgCfg.random_image.unsplash_query, timeout)
        else if (bgCfg.random_image.provider === 'reddit') bgImgUrlJob = queryBgImgUrlReddit(bgCfg.random_image.subreddits, timeout)
        else console.warn('unknown background image provider:', bgCfg.random_image.provider)
      } catch (e) {
        console.error(e)
      }
    } else if (bgCfg.background === 'static') {
      if (bgCfg.static_image.source === 'upload') bgImgUrlJob = '/background/' + bgCfg.static_image.upload_url
      else if (bgCfg.static_image.source === 'web') bgImgUrlJob = bgCfg.static_image.web_url
      else console.warn('unknown background static image source: ', bgCfg.static_image.source)
    }

    bgImg = (async () => {
      if (bgImgUrlJob)
        try {
          return {
            url: await bgImgUrlJob,
            expiresAt: bgCfg.random_image.duration ? epoch() + bgCfg.random_image.duration : undefined
          }
        } catch (e) {
          console.error('Fetch random bg image error:', e)
          return {}
        }
      else return {}
    })()
  } else {
    bgImg = { url: currentBgImgUrl }
  }

  return {
    image: await bgImg,
    triangles: bgCfg.background === 'triangles',
    particles: await particlesJob,
    blur: bgCfg.blur,
    dots: bgCfg.dots
  }
}

export function setBgImgCookie(cookies: Cookies, bgImg: { url?: string; expiresAt?: number }) {
  if (bgImg.url) {
    const expires = new Date(1970, 0, 1, 0, 0)
    if (bgImg.expiresAt) {
      expires.setSeconds(bgImg.expiresAt)
    } else {
      expires.setFullYear(9999)
    }
    cookies.set('bgimg', bgImg.url, { path: '/', expires })
  }
}
