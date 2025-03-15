import fs from 'node:fs'
import { lookup } from 'mrmime'
import { isFile } from '$lib/server/fs'
import { error } from '@sveltejs/kit'
import path from 'node:path'
import { PATHS } from '$lib/server/config'

export async function GET({ params, locals }) {
  const bgCfg = locals.userConfig.backgrounds[0]
  if (bgCfg.background === 'random' && bgCfg.random_image.provider === 'local') {
    const p = path.join(PATHS.WALLPAPER, path.normalize(params.wallpaper))
    if (p.startsWith(PATHS.WALLPAPER)) {
      if (await isFile(p))
        return new Response(fs.createReadStream(p) as unknown as ReadableStream, {
          headers: { 'Content-Type': lookup(params.wallpaper) || 'application/octet-stream' }
        })
      else error(404, 'file not found')
    } else error(400, 'invalid wallpaper path')
  } else error(403, 'wrong background image provider')
}
