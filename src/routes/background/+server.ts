import {generateCurrentBgConfig, setBgImgCookie} from "$lib/server/background";
import {json} from "@sveltejs/kit";

export async function GET({url, locals, cookies}) {
    const background = await generateCurrentBgConfig({userConfig: locals.userConfig, cookies})
    setBgImgCookie(cookies, background.image)
    return json(background)
}
