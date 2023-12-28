import { generateCurrentBgConfig, setBgImgCookie } from '$lib/server/background'
import { json } from '@sveltejs/kit'

export async function GET({ locals, cookies }) {
  const background = await generateCurrentBgConfig({ userConfig: locals.userConfig, timeout: 3_000 })
  setBgImgCookie(cookies, background.image)
  return json(background)
}
