import { error, type Action } from '@sveltejs/kit'
import { setUserConfig, userBackgroundImgFilePath } from '$lib/server/userconfig'
import { deleteFile, writeBinaryFile } from '$lib/server/fs'
import { genRandomId } from '$lib/random'
import type { UserConfig } from '$lib/server/userconfig/types'

export const saveUserConfig: Action = async ({ locals, request }) => {
  const data = await request.formData()
  const userConfigStr = data.get('userConfig')
  if (typeof userConfigStr !== 'string') error(422)
  const userConfig: UserConfig = JSON.parse(userConfigStr)
  await Promise.all(
    userConfig.backgrounds.map(async (elem, idx) => {
      if (typeof elem.static_image?.upload_url !== 'string') {
        const oldImgId = locals.userConfig.backgrounds.find(bg => bg.selected)?.static_image.upload_url
        if (oldImgId) {
          const oldImgPath = userBackgroundImgFilePath(locals.user.userid, oldImgId)
          try {
            await deleteFile(oldImgPath)
          } catch (e) {
            console.error('could not delete old background image:', oldImgPath, e)
          }
        }
        const id = genRandomId()
        await writeBinaryFile(userBackgroundImgFilePath(locals.user.userid, id), Buffer.from(await data.get('bgImg' + idx).arrayBuffer()))
        elem.static_image.upload_url = id
      }
    })
  )
  await setUserConfig(locals.user.userid, userConfig)
  return { message: 'Settings saved' }
}
