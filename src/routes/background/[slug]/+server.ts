import { readBinaryFile } from "$lib/server/fs";
import { userBackgroundImgFilePath } from "$lib/server/userconfig";
import { json } from "@sveltejs/kit";

export async function GET({ params, locals }) {
    const img = await readBinaryFile(userBackgroundImgFilePath(locals.user.userid, params.slug))
    return new Response(img)
}
