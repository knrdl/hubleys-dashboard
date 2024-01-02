import { sysConfig, reloadSysConfig } from '$lib/server/sysconfig'
import { error, type RequestEvent } from '@sveltejs/kit'
import { getUserConfig, initDefaultUserConfig, runUserConfigMigrations } from '$lib/server/userconfig'
import fs from 'fs'
import { isFile } from '$lib/server/fs'
import type { RequestUserInfo } from '$lib/server/types'

function getConfiguredUserLang(ev: RequestEvent) {
  if (ev.locals.userConfig.language === null) return (ev.request.headers.get('accept-language') || 'en').split(/[,;]/)[0]
  else return ev.locals.userConfig.language
}

function sanatizeHeader(ev: RequestEvent, header: string) {
  const val = ev.request.headers.get(header) || ''
  return val.split('\n', 1).shift()?.trim() || ''
}

export async function handle({ event, resolve }) {
  if (sysConfig.demo_mode) {
    const userid = 'demo1'
    event.locals.userConfig = await getUserConfig(userid)
    event.locals.user = {
      userid,
      email: 'demo1@example.org',
      username: 'Demo User 1',
      groups: ['example-group1'],
      isAdmin: true,
      lang: getConfiguredUserLang(event)
    }
    event.locals.sysConfig = sysConfig
    return resolve(event)
  } else {
    const userid = sanatizeHeader(event, sysConfig.userHttpHeaders.userid)
    if (userid.length > 0) {
      event.locals.userConfig = await getUserConfig(userid)
      event.locals.user = {
        userid,
        email: sanatizeHeader(event, sysConfig.userHttpHeaders.email) || null,
        username: sanatizeHeader(event, sysConfig.userHttpHeaders.username) || null,
        groups: sanatizeHeader(event, sysConfig.userHttpHeaders.groups)
          .split(/\s*,\s*/)
          .filter(group => !!group),
        isAdmin: sysConfig.admin_userids.includes(userid),
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
  try {
    await fs.promises.access('/data', fs.constants.W_OK)
  } catch (e) {
    console.log('Missing write permission to the /data volume. The folder must be writable by the user with uid=1000.')
    process.exit(1)
  }
  await Promise.all([
    fs.promises.mkdir('/data/logos', { recursive: true }),
    fs.promises.mkdir('/data/users/backgrounds', { recursive: true }),
    fs.promises.mkdir('/data/users/config', { recursive: true }),
    (async () => {
      if (await isFile('/data/favicon.png')) await fs.promises.copyFile('/data/favicon.png', '/app/client/favicon.png')
    })()
  ])

  await reloadSysConfig()
  applyLogLevels()

  await Promise.all([initDefaultUserConfig(), runUserConfigMigrations()])
  console.debug('up and running')
}

await onServerStartup()
