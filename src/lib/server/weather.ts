import {getConfig} from "./sysconfig";
import {cache} from "$lib/server/httpcache";
import {getUserConfig} from "$lib/server/userconfig";

async function buildSearchParams(userid: string, lang: string) {
    const apiKey = (await getConfig()).openweathermap_api_key
    if (!apiKey)
        throw new Error(('weather error: no api key given'))
    const weatherUserConf = (await getUserConfig(userid)).weather
    const search = new URLSearchParams({appid: apiKey, lang, units: 'metric'})
    if (weatherUserConf.mode === 'zip' && weatherUserConf.zip_code && weatherUserConf.country_code)
        search.set('zip', `${weatherUserConf.zip_code},${weatherUserConf.country_code}`)
    else if (weatherUserConf.mode === 'lonlat' && weatherUserConf.lon && weatherUserConf.lat) {
        search.set('lon', `${weatherUserConf.lon}`)
        search.set('lat', `${weatherUserConf.lat}`)
    } else {
        throw new Error(('weather for user not configured'))
    }
    return search.toString()
}

export async function queryWeatherForecast(userid: string, lang: string) {
    const search = await buildSearchParams(userid, lang)
    const url = 'https://api.openweathermap.org/data/2.5/forecast?' + search
    if (cache(url)) return cache(url)
    const res = await fetch(url)
    if (res.status === 200) {
        const data = await res.json()
        return cache(url, data.list.map(itm => ({
            timestamp: itm.dt,
            wind_speed_kmh: Math.round(itm.wind.speed * 3.6),
            wind_gust_kmh: Math.round(itm.wind.gust * 3.6),
            weather_text: itm.weather[0].description,
            weather_icon_url: 'https://openweathermap.org/img/wn/' + itm.weather[0].icon + '.png',
            visibility_meters: itm.visibility === 10_000 ? true : itm.visibility,
            temp_c: Math.round(itm.main.temp),
            feels_like_temp_c: Math.round(itm.main.feels_like),
            temp_min_c: Math.round(itm.main.temp_min),
            temp_max_c: Math.round(itm.main.temp_max),
            humidity_percent: Math.round(itm.main.humidity),
            pressure_hpa: Math.round(itm.main.pressure)
        })))
    } else {
        throw new Error('weather error: ' + (await res.text()))
    }
}

export async function queryCurrentWeather(userid: string, lang: string) {
    const search = await buildSearchParams(userid, lang)
    const url = 'https://api.openweathermap.org/data/2.5/weather?' + search
    if (cache(url)) return cache(url)
    const res = await fetch(url)
    if (res.status === 200) {
        const data = await res.json()
        return cache(url, {
            wind_kmh: Math.round(data.wind.speed * 3.6),
            weather_type: data.weather[0].main,
            weather_text: data.weather[0].description,
            weather_icon_url: 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png',
            visibility_meters: data.visibility === 10_000 ? true : data.visibility,
            temp_c: Math.round(data.main.temp),
            feels_like_temp_c: Math.round(data.main.feels_like),
            temp_min_c: Math.round(data.main.temp_min),
            temp_max_c: Math.round(data.main.temp_max),
            sunrise_epoch: data.sys.sunrise,
            sunset_epoch: data.sys.sunset,
        })
    } else {
        throw new Error('weather error: ' + (await res.text()))
    }
}
