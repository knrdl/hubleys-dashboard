import { userBackgroundImgFilePath } from '$lib/server/userconfig'
import fs from 'node:fs'
import { lookup } from 'mrmime'
import { isFile } from '$lib/server/fs'
import { error } from '@sveltejs/kit'
import path from 'node:path'
import { isExtensionValidImage } from '$lib/backgrounds/mimetype'

export async function GET({ params, locals }) {
  const bgCfg = locals.userConfig.backgrounds[0]
  if (bgCfg.background === 'static' && bgCfg.static_image.source === 'upload') {
    const imgPath = userBackgroundImgFilePath(params.slug)
    if (await isFile(imgPath)) {
      if (isExtensionValidImage(path.extname(imgPath)))
        return new Response(fs.createReadStream(imgPath) as unknown as ReadableStream, {
          headers: {
            'Content-Type': lookup(params.slug) || 'application/octet-stream',
            'X-Content-Type-Options': 'nosniff'
          }
        })
      else error(500, 'invalid image file')
    } else error(404, 'file not found')
  } else error(403, 'wrong background image provider')
}
