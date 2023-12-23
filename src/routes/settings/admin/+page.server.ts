import type { Actions, PageServerLoad } from './$types'
import { reloadSysConfig } from '$lib/server/sysconfig'
import { error } from '@sveltejs/kit'
import { reloadAllUsersConfig } from '$lib/server/userconfig'
import cache from '$lib/server/httpcache'

export const load: PageServerLoad = async ({ locals }) => {
  return {
    userinfo: locals.user,
    appinfo: locals.sysConfig.appInfo
  }
}

export const actions: Actions = {
  'reload': async ({ locals }) => {
    if (locals.user.isAdmin) {
      await reloadSysConfig()
      await reloadAllUsersConfig()
      await cache.clear()
      return { message: 'Reload successful' }
    } else {
      error(403, 'user is not admin')
    }
  }
}
