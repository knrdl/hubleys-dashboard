import {getUserSearchEngines, getUserTiles} from "$lib/server/authz";
import {queryCalendar} from "$lib/server/calendar";

export const load: PageServerLoad = ({locals}) => {
    return {
        tiles: getUserTiles(locals.user),
        calendarEvents: queryCalendar({
            user: locals.user,
            timeout: locals.sysConfig.server_request_min_timeout
        }),
        searchEngines: getUserSearchEngines(locals.user)
    }
}
