import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    isWeatherProviderConfigured: !!locals.sysConfig.openweathermap_api_key
  }
}
