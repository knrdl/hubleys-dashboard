import { isFile, readJsonFile, writeJsonFile } from '$lib/server/fs'
import path from 'node:path'
import type { UserConfig } from './types'
import { opendir } from 'node:fs/promises'
import { env } from '$env/dynamic/private'

let defaultConfig: UserConfig = (await import('./default.json')).default as UserConfig

type UserId = string

let _cache: Record<UserId, UserConfig> = {}

function userConfigFilePath(userid: UserId) {
  const encUserid = encodeURIComponent(userid)
  return path.join(env.USERS_DIR!, 'config', encUserid + '.json')
}

async function readUserConfig(userid: UserId) {
  const filepath = userConfigFilePath(userid)
  if (await isFile(filepath)) {
    return await readJsonFile<UserConfig>(filepath)
  } else {
    return defaultConfig
  }
}

async function writeUserConfig(userid: UserId, config: UserConfig) {
  const filepath = userConfigFilePath(userid)
  await writeJsonFile(filepath, config)
}

export async function getUserConfig(userid: UserId) {
  if (!_cache[userid]) _cache[userid] = await readUserConfig(userid)
  return _cache[userid]
}

export async function setUserConfig(userid: UserId, config: UserConfig) {
  _cache[userid] = config
  await writeUserConfig(userid, config)
}

export async function reloadAllUsersConfig() {
  _cache = {}
}

export function userBackgroundImgFilePath(imgId: string) {
  return path.join(env.USERS_DIR!, 'backgrounds', path.basename(imgId))
}

export async function initDefaultUserConfig() {
  const filepath = path.join(env.USERS_DIR!, 'default-config.json')
  if (await isFile(filepath)) defaultConfig = await readJsonFile(filepath)
  else await writeJsonFile(filepath, defaultConfig)
}

export async function runUserConfigMigrations() {
  const newest_migration_version = 2
  for await (const e of await opendir(path.join(env.USERS_DIR!, 'config'))) {
    if (e.isFile() && e.name.endsWith('.json')) {
      const p = path.join(e.parentPath, e.name)
      const profile = await readJsonFile<UserConfig>(p)
      if (profile.version < newest_migration_version) {
        console.debug('migrating profile: ', p)
        if (profile.version === 0) {
          // new props
          profile.tiles = { layout: 'center', position: 'bottom' }
          // only the first bg is show in settings ui, so make selected the first one
          const bgIdx = profile.backgrounds.findIndex(bg => bg.selected) || 0
          profile.backgrounds.unshift(profile.backgrounds.splice(bgIdx, 1)[0])
          profile.version = 1
        }
        if (profile.version === 1) {
          profile.weather.units = 'metric'
          profile.version = 2
        }
        await writeJsonFile(p, profile)
      }
    }
  }
}
