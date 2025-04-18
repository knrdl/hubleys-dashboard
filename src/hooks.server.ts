import { sysConfig, reloadSysConfig } from '$lib/server/sysconfig'
import { error, type RequestEvent } from '@sveltejs/kit'
import { getUserConfig, initDefaultUserConfig, runUserConfigMigrations } from '$lib/server/userconfig'
import { canWrite, isDir, isFile } from '$lib/server/fs'
import type { RequestUserInfo } from '$lib/server/types'
import { env } from '$env/dynamic/private'
import path from 'node:path'
import { copyFile, mkdir } from 'node:fs/promises'

function getConfiguredUserLang(ev: RequestEvent) {
  if (ev.locals.userConfig.language === null) return (ev.request.headers.get('accept-language') || 'en').split(/[,;]/)[0]
  else return ev.locals.userConfig.language
}

function sanitizeHeader(ev: RequestEvent, header: string | undefined) {
  if (header) {
    const val = ev.request.headers.get(header) || ''
    return val.split('\n', 1).shift()?.trim() || ''
  }
}

export async function handle({ event, resolve }) {
  if (sysConfig.single_user_mode) {
    const userid = 'defaultuser'
    event.locals.userConfig = await getUserConfig(userid)
    event.locals.user = {
      userid,
      email: null,
      username: null,
      groups: [],
      isAdmin: true,
      lang: getConfiguredUserLang(event)
    }
    event.locals.sysConfig = sysConfig
    return resolve(event)
  } else {
    const userid = sanitizeHeader(event, sysConfig.userHttpHeaders.userid)
    if (userid && userid.length > 0) {
      const groups = (sanitizeHeader(event, sysConfig.userHttpHeaders.groups) || '')
        .split(sysConfig.userHttpHeaders.groups_separator || /\s*[,;:|]\s*/)
        .map(group => group.trim())
        .filter(group => !!group)
      event.locals.userConfig = await getUserConfig(userid)
      event.locals.user = {
        userid,
        email: sanitizeHeader(event, sysConfig.userHttpHeaders.email) || null,
        username: sanitizeHeader(event, sysConfig.userHttpHeaders.username) || null,
        groups,
        isAdmin: sysConfig.admins.includes('user:' + userid) || groups.some(group => sysConfig.admins.includes('group:' + group)),
        lang: getConfiguredUserLang(event)
      } as RequestUserInfo
      event.locals.sysConfig = sysConfig
      return resolve(event)
    } else {
      error(500, 'forward auth not configured')
    }
  }
}

function applyLogLevels() {
  type LogLevel = 'debug' | 'info' | 'warn' | 'error'
  const logLevels: LogLevel[] = ['debug', 'info', 'warn', 'error']
  const shouldLog = (level: LogLevel) => logLevels.indexOf(level) >= logLevels.indexOf(sysConfig.logLevel)
  const _console = global.console
  global.console = {
    ..._console,
    debug: (...params: any[]) => shouldLog('debug') && _console.debug(...params),
    info: (...params: any[]) => shouldLog('info') && _console.info(...params),
    warn: (...params: any[]) => shouldLog('warn') && _console.warn(...params),
    error: (...params: any[]) => shouldLog('error') && _console.error(...params)
  }
}

async function onServerStartup() {
  async function ensureDirExists(dirpath: string) {
    if (await isDir(dirpath)) {
      const writable = await canWrite(dirpath)
      if (!writable) {
        console.error(`Missing write permission for folder "${dirpath}". The folder must be writable by the user with uid=1000.`)
        process.exit(1)
      }
    } else {
      try {
        await mkdir(dirpath, { recursive: true })
      } catch (e) {
        console.error(`Error creating folder "${dirpath}":`)
        console.error(e)
        console.error('The parent folder must be writable by the user with uid=1000 or create the folder manually.')
        process.exit(1)
      }
    }
  }

  await Promise.all([
    ensureDirExists(path.join(env.USERS_DIR!, 'backgrounds')),
    ensureDirExists(path.join(env.USERS_DIR!, 'config')),
    ensureDirExists(env.LOGOS_DIR!),
    (async () => {
      if (await isFile(env.FAVICON_FILE!)) await copyFile(env.FAVICON_FILE!, '/app/client/favicon.png')
    })()
  ])

  await reloadSysConfig()
  applyLogLevels()

  await Promise.all([initDefaultUserConfig(), runUserConfigMigrations()])
  console.debug('up and running')
}

await onServerStartup()
