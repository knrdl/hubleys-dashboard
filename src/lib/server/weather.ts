import { sysConfig } from './sysconfig'
import cache from '$lib/server/httpcache'
import { fetchTimeout } from '$lib/server/fetch'
import type { UserConfig } from './userconfig/types'
import type { CurrentWeather, WeatherForecast } from '../../routes/weather/types'

async function buildSearchParams({ lang, userConfig }: { lang: string; userConfig: UserConfig }) {
  const apiKey = sysConfig.openweathermap_api_key
  if (!apiKey) throw new Error('weather error: no api key given')
  const conf = userConfig.weather
  const search = new URLSearchParams({ appid: apiKey, lang, units: userConfig.weather.units })
  if (conf.mode === 'zip' && conf.zip_code && conf.country_code) search.set('zip', `${conf.zip_code},${conf.country_code}`)
  else if (conf.mode === 'lonlat' && conf.lon && conf.lat) {
    search.set('lon', `${conf.lon}`)
    search.set('lat', `${conf.lat}`)
  } else {
    throw new Error('weather for user not configured')
  }
  return search.toString()
}

export async function queryWeatherForecast({ lang, userConfig }: { lang: string; userConfig: UserConfig }) {
  const isMetric = userConfig.weather.units === 'metric'
  const search = await buildSearchParams({ lang, userConfig })
  const url = 'https://api.openweathermap.org/data/2.5/forecast?' + search
  if (cache.has(url)) return cache.get<WeatherForecast[]>(url)
  const res = await fetch(url)
  if (res.status === 200) {
    const data = await res.json()
    return cache.set<WeatherForecast[]>(
      url,
      data.list.map(
        (itm: any) =>
          ({
            timestamp: itm.dt,
            wind_speed: Math.round(isMetric ? itm.wind.speed * 3.6 : itm.wind.speed), // metric: m/s → km/h, imperial: mph
            wind_gust: Math.round(isMetric ? itm.wind.gust * 3.6 : itm.wind.gust), // metric: m/s → km/h, imperial: mph
            weather_type: itm.weather[0].main,
            weather_text: itm.weather[0].description,
            weather_icon_url: 'https://openweathermap.org/img/wn/' + itm.weather[0].icon + '.png',
            visibility: itm.visibility === 10_000 ? true : itm.visibility,
            temp: Math.round(itm.main.temp),
            feels_like_temp: Math.round(itm.main.feels_like),
            humidity: Math.round(itm.main.humidity),
            pressure: Math.round(itm.main.pressure),
            units: userConfig.weather.units
          }) as WeatherForecast
      )
    )
  } else {
    throw new Error('weather error: ' + (await res.text()))
  }
}

export async function queryCurrentWeather({
  lang,
  userConfig,
  failfast
}: {
  lang: string
  userConfig: UserConfig
  failfast: boolean
}): Promise<CurrentWeather> {
  const isMetric = userConfig.weather.units === 'metric'
  const search = await buildSearchParams({ lang, userConfig })
  const url = 'https://api.openweathermap.org/data/2.5/weather?' + search
  if (cache.has(url)) return cache.get(url)
  const res = await fetchTimeout(url, { failfast })
  if (res.status === 200) {
    const data = await res.json()
    return cache.set<CurrentWeather>(url, {
      wind_speed: Math.round(isMetric ? data.wind.speed * 3.6 : data.wind.speed), // metric: m/s → km/h, imperial: mph
      wind_gust: Math.round(isMetric ? data.wind.gust * 3.6 : data.wind.gust), // metric: m/s → km/h, imperial: mph
      weather_type: data.weather[0].main,
      weather_text: data.weather[0].description,
      weather_icon_url: 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png',
      visibility: data.visibility === 10_000 ? true : data.visibility,
      temp: Math.round(data.main.temp),
      feels_like_temp: Math.round(data.main.feels_like),
      sunrise_epoch: data.sys.sunrise,
      sunset_epoch: data.sys.sunset,
      units: userConfig.weather.units
    })
  } else {
    throw new Error('weather error: ' + (await res.text()))
  }
}
