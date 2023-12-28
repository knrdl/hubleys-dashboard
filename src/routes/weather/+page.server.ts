import { queryCurrentWeather, queryWeatherForecast } from '$lib/server/weather'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  return {
    weatherForecast: await queryWeatherForecast({ lang: locals.user.lang, userConfig: locals.userConfig }),
    currentWeather: await queryCurrentWeather({ lang: locals.user.lang, userConfig: locals.userConfig, failfast: false })
  }
}
