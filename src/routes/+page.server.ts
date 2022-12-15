import {getUserTiles} from "$lib/server/authz";

export const load: PageServerLoad = ({fetch, locals}) => {
    return {
        tiles: getUserTiles(locals.user) // todo: use sveltekit fetch
    }
}
