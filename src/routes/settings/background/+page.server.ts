import type { Actions, PageServerLoad } from './$types'
import { getParticlesList } from '$lib/server/particles'
import { saveUserConfig } from '../utils'

export const load: PageServerLoad = async () => {
  return {
    particleList: await getParticlesList()
  }
}

export const actions: Actions = {
  'reload-random-background-image': async ({ cookies }) => {
    cookies.delete('bgimg', { path: '/' })
  },
  save: async ({ locals, request, cookies }) => {
    await saveUserConfig({ locals, request })
    cookies.delete('bgimg', { path: '/' })
  }
}
