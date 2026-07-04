import { error } from '@sveltejs/kit'
import { setUserConfig, userBackgroundImgFilePath } from '$lib/server/userconfig'
import { genRandomId } from '$lib/server/random'
import type { UserConfig } from '$lib/server/userconfig/types'
import path from 'node:path'
import { writeFile, unlink } from 'node:fs/promises'
import { t } from '$lib/translations'
import { detectImageMimeType, IMG_MIME_EXTENSIONS } from '$lib/backgrounds/mimetype'

export const saveUserConfig = async ({ locals, request }: { locals: App.Locals; request: Request }) => {
  const data = await request.formData()
  const userConfigStr = data.get('userConfig')
  if (typeof userConfigStr !== 'string') error(422)
  const userConfig: UserConfig = JSON.parse(userConfigStr)

  if (data.has('bgImg')) {
    const bgImg = data.get('bgImg')
    if (!(bgImg instanceof File) || bgImg.size === 0) throw error(400, 'Uploaded background image is invalid')

    const maxBgUploadSizeMb = locals.sysConfig.backgroundImgMaxUploadSizeMb
    if (bgImg.size > maxBgUploadSizeMb * 1024 * 1024) throw error(413, `Background image must be ${maxBgUploadSizeMb}MB or smaller`)

    const mimeType = await detectImageMimeType(bgImg)
    const extension = path.extname(bgImg.name).toLowerCase()
    if (!extension || !mimeType || !IMG_MIME_EXTENSIONS[mimeType]?.includes(extension))
      throw error(400, 'Uploaded background image must be a valid PNG, JPEG, GIF, or WebP file')

    const oldImgId = locals.userConfig.backgrounds[0].static_image.upload_url
    if (oldImgId)
      try {
        await unlink(userBackgroundImgFilePath(oldImgId))
      } catch (e) {
        console.error('could not delete old background image:', oldImgId, e)
      }
    const newImgId = genRandomId() + extension
    await writeFile(userBackgroundImgFilePath(newImgId), bgImg.stream() as unknown as NodeJS.ReadableStream)
    userConfig.backgrounds[0].static_image.upload_url = newImgId
  }

  await setUserConfig(locals.user.userid, userConfig)
  return { message: t.get('settings.msg.saved') }
}
