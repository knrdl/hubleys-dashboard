import type {PageServerLoad} from './$types';
import {queryBgImgUrl} from "$lib/server/bgimg";
import {queryCurrentWeather} from "$lib/server/weather";
import {queryCalendar} from "$lib/server/calendar";
import {getUserConfig} from "$lib/server/userconfig";
import {epoch} from "$lib/datetime";
import {readFile} from "$lib/server/fs";
import * as path from "path";

export const load: PageServerLoad = async ({cookies, locals}) => {

    const userConfig = await getUserConfig(locals.user.userid)

    let currentWeather = null
    try {
        currentWeather = await queryCurrentWeather(locals.user.userid, locals.user.lang)
    } catch (e) {
        console.error(e)
    }
    const userBgConfig = userConfig.background_rules.find(rule => {
        if (rule.when) // todo
            return rule
    })?.show

    const particles = userBgConfig.particles ?
        JSON.parse(await readFile(`particles/${path.basename(userBgConfig.particles, '.json')}.json`)) : null


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
            particles,
            blur: userBgConfig.blur,
            dots: userBgConfig.dots,
        },
        currentWeather,
        userConfig,
        calendar: queryCalendar(),
        userLang: locals.user.lang,
        isAdmin: locals.user.isAdmin
    };
};
