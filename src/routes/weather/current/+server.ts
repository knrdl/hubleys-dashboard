import {queryCurrentWeather} from "$lib/server/weather";
import {error, json} from "@sveltejs/kit";

export async function GET({url, locals}) {
    if (locals.sysConfig.openweathermap_api_key) {
        return json(await queryCurrentWeather({lang: locals.user.lang, userConfig: locals.userConfig}))
    } else {
        throw error(500, 'weather provider not configured')
    }
}
