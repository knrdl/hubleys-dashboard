import type { LayoutServerLoad } from './$types'
import { queryCurrentWeather } from '$lib/server/weather'
import { generateCurrentBgConfig, setBgImgCookie } from '$lib/server/background'
import { loadTranslations } from '$lib/translations'

export const load: LayoutServerLoad = async ({ url, cookies, locals }) => {
  const currentWeatherJob = (async () => {
    try {
      if (locals.sysConfig.openweathermap_api_key) return await queryCurrentWeather({ lang: locals.user.lang, userConfig: locals.userConfig, failfast: true })
      else return 'NOT_ENABLED'
    } catch (e) {
      if (e instanceof Error && e.message === 'weather for user not configured') return 'NOT_CONFIGURED'
      else return null
    }
  })()

  const { pathname } = url
  const translationsJob = loadTranslations(locals.user.lang, pathname)

  const background = await generateCurrentBgConfig({
    currentBgImgUrl: cookies.get('bgimg'),
    userConfig: locals.userConfig,
    failfast: true
  })
  setBgImgCookie(cookies, background.image)

  await translationsJob

  return {
    background, // loaded from here or /background on timeout
    currentWeather: await currentWeatherJob, // loaded from here or /weather/current on timeout
    userConfig: locals.userConfig,
    userLang: locals.user.lang,
    isAdmin: locals.user.isAdmin
  }
}
