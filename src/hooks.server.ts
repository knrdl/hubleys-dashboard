import {getConfig} from "$lib/server/sysconfig";
import {error} from "@sveltejs/kit";

export async function handle({event, resolve}) {
    const userid = event.request.headers.get('Remote-User')
    if (userid?.length > 0) {
        event.locals.user = {
            userid,
            email: event.request.headers.get('Remote-Email') || null,
            username: event.request.headers.get('Remote-Name') || null,
            groups: (event.request.headers.get('Remote-Groups') || '').split(/\s*,\s*/).filter(group => !!group),
            isAdmin: (await getConfig()).admin_userids.includes(userid),
            lang: (event.request.headers.get('accept-language') || 'en').split(/[,;]/)[0]
        }
        return resolve(event)
    } else {
        throw error(500, 'forward auth not configured')
    }
}
