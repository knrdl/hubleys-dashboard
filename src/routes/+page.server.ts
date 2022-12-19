import {getUserSearchEngines, getUserTiles} from "$lib/server/authz";
import {queryCalendar} from "$lib/server/calendar";

export const load: PageServerLoad = ({locals}) => {
    return {
        tiles: getUserTiles(locals.user),
        calendar: queryCalendar(),
        searchEngines: getUserSearchEngines(locals.user)
    }
}
