import { epoch } from '$lib/datetime'
import type { Cookies } from '@sveltejs/kit'
import type { BackgroundConfig, UserConfig } from './userconfig/types'
import { queryBgImgUrlReddit, queryBgImgUrlUnsplash } from '$lib/backgrounds/random'

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
    particles: bgCfg.particles,
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
