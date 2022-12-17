import {getUserSearchEngines, getUserTiles} from "$lib/server/authz";

export const load: PageServerLoad = ({locals}) => {
    return {
        tiles: getUserTiles(locals.user),
        searchEngines: getUserSearchEngines(locals.user)
    }
}
