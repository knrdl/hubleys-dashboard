import { readBinaryFile } from '$lib/server/fs'
import { userBackgroundImgFilePath } from '$lib/server/userconfig'

export async function GET({ params, locals }) {
  const img = await readBinaryFile(userBackgroundImgFilePath(locals.user.userid, params.slug))
  return new Response(img)
}
