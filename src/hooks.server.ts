import {getConfig} from "$lib/server/sysconfig";
import {error} from "@sveltejs/kit";
import {getUserConfig} from "$lib/server/userconfig";

export async function handle({event, resolve}) {
    const config = await getConfig()
    if (config.demo_mode) { // todo: ugly demo mode
        event.locals.user = {
            userid: 'demo1',
            email: 'demo1@example.org',
            username: 'Demo User 1',
            groups: ['example-group1'],
            isAdmin: true,
            lang: (event.request.headers.get('accept-language') || 'en').split(/[,;]/)[0]
        } as RequestUserInfo
        event.locals.sysConfig = config
        event.locals.userConfig = await getUserConfig(event.locals.user.userid)
        return resolve(event)
    } else {
        const userid = event.request.headers.get('Remote-User')
        if (userid?.length > 0) {
            event.locals.userConfig = await getUserConfig(userid)
            event.locals.user = {
                userid,
                email: event.request.headers.get('Remote-Email') || null,
                username: event.request.headers.get('Remote-Name') || null,
                groups: (event.request.headers.get('Remote-Groups') || '').split(/\s*,\s*/).filter(group => !!group),
                isAdmin: config.admin_userids.includes(userid),
                lang: event.locals.userConfig.language === null ? (event.request.headers.get('accept-language') || 'en').split(/[,;]/)[0] : event.locals.userConfig.language
            } as RequestUserInfo
            event.locals.sysConfig = config
            return resolve(event)
        } else {
            throw error(500, 'forward auth not configured')
        }
    }
}
