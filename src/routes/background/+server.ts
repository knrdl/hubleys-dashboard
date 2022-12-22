import {error, json} from "@sveltejs/kit";
import {getParticlesConfig} from "$lib/server/particles";
import {queryBgImgUrlReddit, queryBgImgUrlUnsplash} from "$lib/server/bgimg";
import {queryCurrentWeather} from "$lib/server/weather";
import {epoch} from "$lib/datetime";

export async function GET({url, locals, cookies}) {
    const weekday = Math.max(0, Math.min(6, parseInt(url.searchParams.get('weekday')))) as Weekday
    const hour = Math.max(0, Math.min(23, parseInt(url.searchParams.get('hour'))))
    if (isNaN(weekday) || isNaN(hour)) {
        throw error(422)
    }

    let currentWeather: CurrentWeather | undefined = undefined

    async function isRuleMatching(criteria: BackgroundRuleCriterion[]) {
        for (const criterion of criteria) {
            if (criterion.condition === 'weather' || criterion.condition === 'temperature') {
                if (!currentWeather) currentWeather = await queryCurrentWeather({
                    lang: locals.user.lang, userConfig: locals.userConfig
                })
            }
            switch (criterion.condition) {
                case 'hour':
                    if (!criterion.values.some(val => hour >= val[0] && hour < val[1])) return false
                    break
                case 'weekday':
                    if (!criterion.values.includes(weekday)) return false
                    break
                case 'weather':
                    if (currentWeather && !criterion.values.includes(currentWeather.weather_type)) return false
                    break
                case 'temperature':
                    if (currentWeather && !criterion.values.some(val => currentWeather.temp_c >= val[0] && currentWeather.temp_c < val[1])) return false
                    break
                default:
                    console.warn('unknown condition: ', criterion)
            }
        }
        return true
    }

    const userBgRule: BackgroundRule = locals.userConfig.background_rules.find(rule => isRuleMatching(rule.when))

    const bgCfg = userBgRule.show

    const particlesJob = bgCfg.particles ? getParticlesConfig(bgCfg.particles) : null

    let bgImgUrlJob = null
    let bgImgExpirationDuration = null
    if (bgCfg.background === 'random') {
        try {
            if (bgCfg.random_image.provider === 'unsplash')
                bgImgUrlJob = queryBgImgUrlUnsplash(bgCfg.random_image.unsplash_query)
            else if (bgCfg.random_image.provider === 'reddit')
                bgImgUrlJob = queryBgImgUrlReddit(bgCfg.random_image.subreddits)
            else
                console.warn('unknown background image provider:', bgCfg.random_image.provider)
            if (bgCfg.random_image.duration) bgImgExpirationDuration = bgCfg.random_image.duration
            // const expires = new Date()
            // if (userBgConfig.random_image.duration)
            //     expires.setSeconds(expires.getSeconds() + userBgConfig.random_image.duration)
            // else
            //     expires.setFullYear(9999)
            // cookies.set('bgimg', bgImgUrl, {path: '/', expires})
        } catch (e) {
            console.error(e)
        }
    } else if (bgCfg.background === 'static') {
        // if (userBgConfig.static_image.format === 'url')
        bgImgUrlJob = bgCfg.static_image.value
        // else
        //     console.error('image upload not implemented') // todo
    }

    return json(
        {
            image: bgImgUrlJob ? {
                url: await bgImgUrlJob,
                expiresAt: bgImgExpirationDuration === null ? null : epoch() + bgImgExpirationDuration
            } : null,
            triangles: bgCfg.background === 'triangles',
            particles: await particlesJob,
            blur: bgCfg.blur,
            dots: bgCfg.dots,
        }
    )
}
