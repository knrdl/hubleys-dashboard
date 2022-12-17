import {error} from "@sveltejs/kit";
import {setUserConfig} from "$lib/server/userconfig";

export const saveUserConfig = async ({locals, request}) => {
    const data = await request.formData()
    const userConfigStr = data.get('userConfig')
    if (typeof userConfigStr !== "string") throw error(422)
    const userConfig = JSON.parse(userConfigStr)
    await setUserConfig(locals.user.userid, userConfig)
    return {message: 'Settings saved'}
}
