import type {PageServerLoad} from './$types';
import {queryBgImgUrl} from "$lib/server/bgimg";
import {queryCurrentWeather} from "$lib/server/weather";
import {epoch} from "$lib/datetime";
import {getParticlesConfig} from "$lib/server/particles";

export const load: PageServerLoad = async ({cookies, locals}) => {

    let currentWeatherJob = (async () => {
        try {
            if (locals.sysConfig.openweathermap_api_key)
                return await queryCurrentWeather({lang: locals.user.lang, userConfig: locals.userConfig, timeout: 750})
            else return null
        } catch (e) {
            console.error(e)
            return null
        }
    })()

    const userBgConfig = locals.userConfig.background_rules.find(rule => {
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
        background: (async () => ({
            image: bgImgUrl ? {
                url: bgImgUrl,
                expiresAt: epoch() + userBgConfig.random_image.duration // todo
            } : null,
            triangles: userBgConfig.background === 'triangles',
            particles: await particlesJob,
            blur: userBgConfig.blur,
            dots: userBgConfig.dots,
        }))(),
        currentWeather: currentWeatherJob,
        userConfig: locals.userConfig,
        userLang: locals.user.lang,
        isAdmin: locals.user.isAdmin
    };
};
