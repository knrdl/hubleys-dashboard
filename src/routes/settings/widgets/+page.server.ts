import {setUserConfig} from "$lib/server/userconfig";
import {Actions, error} from "@sveltejs/kit";

//todo: deduplicate
export const actions: Actions = {
    save: async ({locals, request}) => {
        const data = await request.formData()
        const userConfigStr = data.get('userConfig')
        if (typeof userConfigStr !== "string") throw error(422)
        const userConfig = JSON.parse(userConfigStr)
        await setUserConfig(locals.user.userid, userConfig)
        return {message: 'Settings saved'}
    }
};
