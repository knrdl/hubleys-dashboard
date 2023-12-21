import type { PageServerLoad } from './$types'
import { queryCurrentWeather } from '$lib/server/weather'
import { generateCurrentBgConfig, setBgImgCookie } from '$lib/server/background'

export const load: PageServerLoad = async ({ cookies, locals }) => {
  const currentWeatherJob = (async () => {
    try {
      if (locals.sysConfig.openweathermap_api_key)
        return await queryCurrentWeather({
          lang: locals.user.lang,
          userConfig: locals.userConfig,
          timeout: locals.sysConfig.server_request_timeout
        })
      else return 'NOT_ENABLED'
    } catch (e) {
      if (e instanceof Error && e.message === 'weather for user not configured') return 'NOT_CONFIGURED'
      else return null
    }
  })()

  const background = await generateCurrentBgConfig({
    currentBgImgUrl: cookies.get('bgimg'),
    userConfig: locals.userConfig,
    timeout: locals.sysConfig.server_request_timeout
  })
  setBgImgCookie(cookies, background.image)

  return {
    background, // loaded from here or /background on timeout
    currentWeather: await currentWeatherJob, // loaded from here or /weather/current on timeout
    userConfig: locals.userConfig,
    userLang: locals.user.lang,
    isAdmin: locals.user.isAdmin
  }
}
