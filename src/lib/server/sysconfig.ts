import yaml from 'js-yaml'
import { env } from '$env/dynamic/private'
import { readFile } from '$lib/server/fs'

let config: Sysconfig

async function loadConfig() {
  const isDemoMode = ['1', 'true', 'yes'].includes((env.DEMO_MODE || '').toLowerCase().trim())
  const configFile = readFile(isDemoMode ? '/app/demo/config.yml' : '/data/config.yml')
  const config = yaml.load(await configFile) as Sysconfig
  return {
    ...config,
    demo_mode: isDemoMode,
    admin_userids: (env.ADMIN_USERIDS || '').split(/\s*[,;:]\s*/).filter(userid => !!userid),
    unsplash_api_key: env.UNSPLASH_API_KEY || null,
    openweathermap_api_key: env.OPENWEATHERMAP_API_KEY || null,
    server_request_timeout: parseInt(env.SERVER_REQUEST_TIMEOUT as string),
    userHttpHeaders: {
      userid: env.HTTP_HEADER_USERID,
      email: env.HTTP_HEADER_USERNAME,
      username: env.HTTP_HEADER_EMAIL,
      groups: env.HTTP_HEADER_GROUPS
    },
  } as Sysconfig
}

export async function reloadSysConfig() {
  config = await loadConfig()
}

export async function getSysConfig() {
  if (!config) config = await loadConfig()
  return config
}
