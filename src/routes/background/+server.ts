import { generateCurrentBgConfig, setBgImgCookie } from '$lib/server/background'
import { json } from '@sveltejs/kit'

export async function GET({ locals, cookies }) {
  const background = await generateCurrentBgConfig({ userConfig: locals.userConfig })
  setBgImgCookie(cookies, background.image)
  return json(background)
}
