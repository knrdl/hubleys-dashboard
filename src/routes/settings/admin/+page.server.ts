import type { Actions, PageServerLoad } from './$types'
import { reloadSysConfig } from '$lib/server/sysconfig'
import { error } from '@sveltejs/kit'
import { reloadAllUsersConfig } from '$lib/server/userconfig'
import cache from '$lib/server/httpcache'

export const load: PageServerLoad = async ({ locals }) => {
  return {
    userinfo: locals.user
  }
}

export const actions: Actions = {
  'reload-system-config': async ({ locals }) => {
    if (locals.user.isAdmin) {
      await reloadSysConfig()
      return { message: 'Reloaded System Config' }
    } else {
      error(403, 'user is not admin')
    }
  },
  'reload-users-config': async ({ locals }) => {
    if (locals.user.isAdmin) {
      await reloadAllUsersConfig()
      return { message: 'Reloaded Users Config' }
    } else {
      error(403, 'user is not admin')
    }
  },
  'clear-http-cache': async ({ locals }) => {
    if (locals.user.isAdmin) {
      await cache.clear()
      return { message: 'Cleared HTTP Cache' }
    } else {
      error(403, 'user is not admin')
    }
  }
}
