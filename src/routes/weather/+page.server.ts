import {queryWeatherForecast} from "$lib/server/weather";

export const load: PageServerLoad = async ({locals}) => {
    return {
        weatherForecast: queryWeatherForecast(locals.user.userid, locals.user.lang)
    };
};
