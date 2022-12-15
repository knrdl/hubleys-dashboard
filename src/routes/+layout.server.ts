import type {PageServerLoad} from './$types';
import {queryBgImgUrl} from "$lib/server/bgimg";
import {queryCurrentWeather} from "$lib/server/weather";
import {queryCalendar} from "$lib/server/calendar";
import {getUserConfig} from "$lib/server/userconfig";
import {epoch} from "$lib/datetime";
import {getParticlesConfig} from "$lib/server/particles";

export const load: PageServerLoad = async ({cookies, locals}) => {

    const userConfig = await getUserConfig(locals.user.userid)

    let currentWeatherJob = (async () => {
        try {
            return await queryCurrentWeather(locals.user.userid, locals.user.lang)
        } catch (e) {
            console.error(e)
            return null
        }
    })()

    const userBgConfig = userConfig.background_rules.find(rule => {
        if (rule.when) // todo
            return rule
    })?.show

    const particlesJob = userBgConfig.particles ? getParticlesConfig(userBgConfig.particles) : null


    let bgImgUrl = null
    if (userBgConfig.background === 'random') {
        bgImgUrl = cookies.get('bgimg')
        if (!bgImgUrl)
            try {//todo: also save search term to cookie
                bgImgUrl = await queryBgImgUrl(userBgConfig.random_image.query)
                const expires = new Date()
                if (userBgConfig.random_image.duration)
                    expires.setSeconds(expires.getSeconds() + userBgConfig.random_image.duration)
                else
                    expires.setFullYear(9999)
                cookies.set('bgimg', bgImgUrl, {path: '/', expires})
            } catch (e) {
                console.error(e)
            }
    } else if (userBgConfig.background === 'static') {
        bgImgUrl = '' // todo
    }
    return {
        background: {
            image: bgImgUrl ? {
                url: bgImgUrl,
                expiresAt: epoch() + userBgConfig.random_image.duration // todo
            } : null,
            triangles: userBgConfig.background === 'triangles',
            particles: particlesJob,
            blur: userBgConfig.blur,
            dots: userBgConfig.dots,
        },
        currentWeather: currentWeatherJob,
        userConfig,
        calendar: queryCalendar(),
        userLang: locals.user.lang,
        isAdmin: locals.user.isAdmin
    };
};
