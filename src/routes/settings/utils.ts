import { error } from '@sveltejs/kit'
import { setUserConfig, userBackgroundImgFilePath } from '$lib/server/userconfig'
import { genRandomId } from '$lib/server/random'
import type { UserConfig } from '$lib/server/userconfig/types'
import path from 'path'
import { writeFile, unlink } from 'node:fs/promises'
import { t } from '$lib/translations'

export const saveUserConfig = async ({ locals, request }: { locals: App.Locals; request: Request }) => {
  const data = await request.formData()
  const userConfigStr = data.get('userConfig')
  if (typeof userConfigStr !== 'string') error(422)
  const userConfig: UserConfig = JSON.parse(userConfigStr)

  if (data.has('bgImg')) {
    const oldImgId = locals.userConfig.backgrounds[0].static_image.upload_url
    if (oldImgId)
      try {
        await unlink(userBackgroundImgFilePath(oldImgId))
      } catch (e) {
        console.error('could not delete old background image:', oldImgId, e)
      }
    const bgImg = (await data.get('bgImg')) as File
    const newImgId = genRandomId() + path.extname(bgImg.name)
    await writeFile(userBackgroundImgFilePath(newImgId), bgImg.stream() as unknown as NodeJS.ReadableStream)
    userConfig.backgrounds[0].static_image.upload_url = newImgId
  }
  await setUserConfig(locals.user.userid, userConfig)
  return { message: t.get('settings.msg.saved') }
}
