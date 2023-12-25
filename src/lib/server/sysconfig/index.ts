import yaml from 'js-yaml'
import { env } from '$env/dynamic/private'
import { PUBLIC_BUILD_DATE, PUBLIC_VERSION } from '$env/static/public'
import { isFile } from '$lib/server/fs'
import fs from 'fs'
import type { Sysconfig, Tile } from './types'

let config: Sysconfig

async function loadConfig(): Promise<Sysconfig> {
  const configpath = '/data/config.yml'

  if (!(await isFile(configpath))) {
    const body = (await import('./default.yml?raw')).default
    await fs.promises.writeFile(configpath, body, { encoding: 'utf8' })
  }

  const configFile = await fs.promises.readFile(configpath, { encoding: 'utf8' })
  const config = yaml.load(configFile) as Sysconfig
  return {
    ...config,
    demo_mode: ['1', 'true', 'yes'].includes((env.DEMO_MODE || '').toLowerCase().trim()),
    admin_userids: (env.ADMIN_USERIDS || '').split(/\s*[,;:]\s*/).filter(userid => !!userid),
    unsplash_api_key: env.UNSPLASH_API_KEY || null,
    openweathermap_api_key: env.OPENWEATHERMAP_API_KEY || null,
    server_request_timeout: parseInt(env.SERVER_REQUEST_TIMEOUT as string),
    userHttpHeaders: {
      userid: env.HTTP_HEADER_USERID as string,
      email: env.HTTP_HEADER_USERNAME as string,
      username: env.HTTP_HEADER_EMAIL as string,
      groups: env.HTTP_HEADER_GROUPS as string
    },
    appInfo: { buildDate: PUBLIC_BUILD_DATE || 'unknown', version: PUBLIC_VERSION || 'edge' }
  }
}

export async function reloadSysConfig() {
  config = await loadConfig()
}

export async function getSysConfig() {
  if (!config) config = await loadConfig()
  return config
}
