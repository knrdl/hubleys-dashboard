import { isFile, readJsonFile, writeJsonFile } from '$lib/server/fs'
import path from 'node:path'
import type { UserConfig } from './types'

let defaultConfig: UserConfig = (await import('./default.json')).default as UserConfig

type UserId = string

let _cache: Record<UserId, UserConfig> = {}

function userConfigFilePath(userid: UserId) {
  const encUserid = encodeURIComponent(userid)
  return '/data/users/config/' + encUserid + '.json'
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
  return path.join('/data/users/backgrounds/', path.basename(imgId))
}

export async function initDefaultUserConfig() {
  const path = '/data/users/default-config.json'
  if (await isFile(path)) defaultConfig = await readJsonFile(path)
  else await writeJsonFile(path, defaultConfig)
}

export async function runUserConfigMigrations() {
  // todo
}
