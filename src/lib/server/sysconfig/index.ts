import yaml from 'js-yaml'
import { env } from '$env/dynamic/private'
import { PUBLIC_BUILD_DATE, PUBLIC_VERSION } from '$env/static/public'
import { isFile } from '$lib/server/fs'
import fs from 'fs'
import type { Sysconfig, SysconfigTile } from './types'

export let sysConfig: Sysconfig

function sanatizeFileConfig(config: Sysconfig) {
  function sanatizeTileRules(tile: SysconfigTile) {
    if (typeof tile.allow === 'string') tile.allow = [tile.allow]
    if (typeof tile.deny === 'string') tile.deny = [tile.deny]
  }
  function sanatizeTileMenu(tile: SysconfigTile) {
    sanatizeTileRules(tile)
    if (tile.menu) {
      if (Array.isArray(tile.menu)) {
        tile.menu = { tiles: tile.menu, title: '' }
      }
      tile.menu.title = tile.menu.title || tile.title
      tile.menu.subtitle = tile.menu.subtitle || (tile.menu.title ? undefined : tile.subtitle)
      tile.menu.tiles.forEach(t => sanatizeTileMenu(t))
      sanatizeTileRules(tile.menu)
    }
  }
  config.tiles.forEach(tile => sanatizeTileMenu(tile))
}

async function loadConfig(): Promise<Sysconfig> {
  const configpath = '/data/config.yml'

  if (!(await isFile(configpath))) {
    const body = (await import('./default.yml?raw')).default
    await fs.promises.writeFile(configpath, body, { encoding: 'utf8' })
  }

  const configFile = await fs.promises.readFile(configpath, { encoding: 'utf8' })
  const config = yaml.load(configFile) as Sysconfig
  sanatizeFileConfig(config)

  return {
    ...config,
    demo_mode: ['1', 'true', 'yes'].includes((env.DEMO_MODE || '').toLowerCase().trim()),
    admin_userids: (env.ADMIN_USERIDS || '').split(/\s*[,;:]\s*/).filter(userid => !!userid),
    unsplash_api_key: env.UNSPLASH_API_KEY || null,
    openweathermap_api_key: env.OPENWEATHERMAP_API_KEY || null,
    server_request_timeout: {
      failfast: parseInt(env.SERVER_REQUEST_FAILFAST_TIMEOUT as string),
      max: parseInt(env.SERVER_REQUEST_MAX_TIMEOUT as string)
    },
    httpcache_ttl: parseInt(env.SERVER_REQUEST_CACHE_TTL as string),
    userHttpHeaders: {
      userid: env.HTTP_HEADER_USERID as string,
      email: env.HTTP_HEADER_USERNAME as string,
      username: env.HTTP_HEADER_EMAIL as string,
      groups: env.HTTP_HEADER_GROUPS as string
    },
    logLevel: (env.LOG_LEVEL || 'info') as any,
    appInfo: { buildDate: PUBLIC_BUILD_DATE || 'unknown', version: PUBLIC_VERSION || 'edge' }
  }
}

export async function reloadSysConfig() {
  sysConfig = await loadConfig()
}
