import type {Actions} from './$types';
import {getParticlesList} from "$lib/server/particles";
import {saveUserConfig} from "../utils";

export const load: PageServerLoad = async ({cookies, url, locals}) => {
    return {
        particleList: getParticlesList()
    }
}


export const actions: Actions = {
    "reload-random-background-image": async ({request, locals, cookies}) => {
        cookies.delete('bgimg', {path: '/'})
    },
    save: saveUserConfig
};
