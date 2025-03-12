import yaml from 'js-yaml'
import { env } from '$env/dynamic/private'
import { PUBLIC_BUILD_DATE, PUBLIC_VERSION } from '$env/static/public'
import { isFile } from '$lib/server/fs'
import fs from 'fs'
import type { FileSysconfig, Sysconfig, SysconfigSection, SysconfigTile } from './types'
import { PATHS } from '$lib/server/config'

export let sysConfig: Sysconfig

function sanitizeFileConfig(config: FileSysconfig) {
  function sanitizeTileMenu(tile: SysconfigTile) {
    if (tile.menu) {
      if (Array.isArray(tile.menu)) {
        tile.menu = { tiles: tile.menu, title: '' }
      }
      tile.menu.title = tile.menu.title || tile.title
      tile.menu.subtitle = tile.menu.subtitle || (tile.menu.title ? undefined : tile.subtitle)
      tile.menu.tiles.forEach(t => sanitizeTileMenu(t))
    }
  }

  function sanitizeAccessRules(entry: SysconfigSection | SysconfigTile) {
    if (typeof entry.allow === 'string') entry.allow = [entry.allow]
    else if (typeof entry.allow === 'undefined') entry.allow = true
    if (typeof entry.deny === 'string') entry.deny = [entry.deny]
    else if (typeof entry.deny === 'undefined') entry.deny = false

    const ruleRegex = /^(user|username|email|mail|group):.+$/
    if (Array.isArray(entry.allow)) entry.allow.filter(e => !e.match(ruleRegex)).forEach(v => console.error(`invalid allow rule value: "${v}"`))
    if (Array.isArray(entry.deny)) entry.deny.filter(e => !e.match(ruleRegex)).forEach(v => console.error(`invalid deny rule value: "${v}"`))

    // tiles menu
    if ('menu' in entry && entry.menu) {
      sanitizeAccessRules(entry.menu)
      entry.menu.tiles.forEach(tile => sanitizeAccessRules(tile))
    }
    // section tiles
    if ('tiles' in entry && entry.tiles) entry.tiles.forEach(tile => sanitizeAccessRules(tile))
  }

  const kinds: (keyof FileSysconfig)[] = ['search_engines', 'calendars', 'messages']
  kinds.forEach(kind => {
    config[kind] ||= []
    config[kind]?.forEach(entry => {
      if (typeof entry.allow === 'undefined') {
        console.warn(`Config entry ${JSON.stringify(entry)} in "${kind}" has no "allow" attribute. It will never show up!`)
        entry.allow = false
      }
    })
  })

  config.sections ||= []
  // tiles as top level config entry exists for backwards compatibility
  if (config.tiles) {
    config.tiles.forEach(tile => {
      if (typeof tile.allow === 'undefined') {
        console.warn(`Tile "${tile.title}" has no "allow" attribute. It will never show up!`)
        tile.allow = false
      }
    })
    config.sections.unshift({ allow: true, tiles: config.tiles })
    delete config.tiles
  }

  // either the section must have a `allow` rule OR each direct `tile` child
  config.sections.forEach(section => {
    section.tiles = section.tiles || []
    if (typeof section.allow === 'undefined') {
      section.allow = true
      section.tiles.forEach(tile => {
        if (typeof tile.allow === 'undefined') {
          tile.allow = false
          console.warn(`Tile "${tile.title}" has no "allow" attribute. It will never show up! Add the "allow" attribute to the tile or its section.`)
        }
      })
    }
  })
  config.sections.forEach(section => section.tiles.forEach(tile => sanitizeTileMenu(tile)))
  config.sections.forEach(section => sanitizeAccessRules(section))
}

async function loadConfig(): Promise<Sysconfig> {
  if (!(await isFile(PATHS.CONFIG))) {
    const body = (await import('./default.yml?raw')).default
    await fs.promises.writeFile(PATHS.CONFIG, body, { encoding: 'utf8' })
  }

  const configFile = await fs.promises.readFile(PATHS.CONFIG, { encoding: 'utf8' })
  const config = yaml.load(configFile) as FileSysconfig
  sanitizeFileConfig(config)

  const adminUserIds = (env.ADMIN_USERIDS || '')
    .split(/\s*[,;:|]\s*/)
    .map(userid => userid.trim())
    .filter(userid => !!userid)
    .map(userid => 'user:' + userid)
  const admins = (env.ADMINS || '').split(/\s*[,;|]\s*/).filter(adm => !!adm)
  admins.forEach(adm => {
    if (!/^(user|group):/.test(adm)) console.error('invalid admin identifier:', adm)
  })

  return {
    ...config,
    single_user_mode: ['1', 'true', 'yes'].includes((env.SINGLE_USER_MODE || '').toLowerCase().trim()),
    admins: [...adminUserIds, ...admins],
    unsplash_api_key: env.UNSPLASH_API_KEY || null,
    openweathermap_api_key: env.OPENWEATHERMAP_API_KEY || null,
    server_request_timeout: {
      failfast: parseInt(env.SERVER_REQUEST_FAILFAST_TIMEOUT as string),
      max: parseInt(env.SERVER_REQUEST_MAX_TIMEOUT as string)
    },
    httpcache_ttl: parseInt(env.SERVER_REQUEST_CACHE_TTL as string),
    userHttpHeaders: {
      userid: env.HTTP_HEADER_USERID as string,
      email: env.HTTP_HEADER_EMAIL,
      username: env.HTTP_HEADER_USERNAME,
      groups: env.HTTP_HEADER_GROUPS,
      groups_separator: env.HTTP_HEADER_GROUPS_SEPARATOR
    },
    logLevel: (env.LOG_LEVEL || 'info') as any,
    appInfo: { buildDate: PUBLIC_BUILD_DATE || 'unknown', version: PUBLIC_VERSION || 'edge' }
  }
}

export async function reloadSysConfig() {
  sysConfig = await loadConfig()
}
