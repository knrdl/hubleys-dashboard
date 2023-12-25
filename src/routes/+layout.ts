import { setLocale, setRoute } from '$lib/translations'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data, url }) => {
  const { pathname } = url

  await setRoute(pathname)
  await setLocale(data.userLang)

  return data
}
