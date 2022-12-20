import {queryCurrentWeather, queryWeatherForecast} from "$lib/server/weather";

export const load: PageServerLoad = async ({locals}) => {
    return {
        weatherForecast: queryWeatherForecast({lang: locals.user.lang, userConfig: locals.userConfig}),
        currentWeather: queryCurrentWeather({lang: locals.user.lang, userConfig: locals.userConfig})
    }
}
