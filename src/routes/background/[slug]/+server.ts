import { userBackgroundImgFilePath } from '$lib/server/userconfig'
import fs from 'node:fs'

export async function GET({ params }) {
  const img = fs.createReadStream(userBackgroundImgFilePath(params.slug))
  return new Response(img as unknown as ReadableStream)
}
