import type {PageServerLoad} from './$types';
import {queryCurrentWeather} from "$lib/server/weather";

export const load: PageServerLoad = async ({cookies, locals}) => {

    let currentWeatherJob = (async () => {
        try {
            if (locals.sysConfig.openweathermap_api_key)
                return await queryCurrentWeather({
                    lang: locals.user.lang,
                    userConfig: locals.userConfig,
                    timeout: locals.sysConfig.server_request_min_timeout
                })
            else return 'NOT_ENABLED'
        } catch (e) {
            if (e.message === 'weather for user not configured')
                return 'NOT_CONFIGURED'
            else
                return null
        }
    })()

    return {
        background: null, // loaded from /backgrounds
        currentWeather: currentWeatherJob, // loaded from here or /weather/current on timeout
        userConfig: locals.userConfig,
        userLang: locals.user.lang,
        isAdmin: locals.user.isAdmin
    };
};
