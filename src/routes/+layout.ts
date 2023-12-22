import { setLocale, setRoute } from '$lib/translations'
import type { Load } from '@sveltejs/kit'

export const load: Load = async ({ data, url }) => {
  const { pathname } = url

  await setRoute(pathname)
  await setLocale(data.userLang)

  return data
}
