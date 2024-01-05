import { userBackgroundImgFilePath } from '$lib/server/userconfig'
import fs from 'node:fs'
import { lookup } from 'mrmime'
import { isFile } from '$lib/server/fs'
import { error } from '@sveltejs/kit'

export async function GET({ params }) {
  const path = userBackgroundImgFilePath(params.slug)
  if (await isFile(path))
    return new Response(fs.createReadStream(path) as unknown as ReadableStream, {
      headers: { 'Content-Type': lookup(params.slug) || 'application/octet-stream' }
    })
  else error(404, 'file not found')
}
