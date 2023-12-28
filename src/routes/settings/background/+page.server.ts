import type { Actions, PageServerLoad } from './$types'
import { saveUserConfig } from '../utils'
import { getParticlesList } from '$lib/backgrounds/particles'

export const load: PageServerLoad = async () => {
  return {
    particleList: getParticlesList()
  }
}

export const actions: Actions = {
  'reload-random-background-image': async ({ cookies }) => {
    cookies.delete('bgimg', { path: '/' })
  },
  save: async ({ locals, request, cookies }) => {
    const job = saveUserConfig({ locals, request })
    cookies.delete('bgimg', { path: '/' })
    return await job
  }
}
