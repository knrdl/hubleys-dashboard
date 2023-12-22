import { getConfig } from '$lib/server/sysconfig'
import { error, type RequestEvent } from '@sveltejs/kit'
import { getUserConfig } from '$lib/server/userconfig'

function getConfiguredUserLang(event: RequestEvent) {
  if (event.locals.userConfig.language === null) return (event.request.headers.get('accept-language') || 'en').split(/[,;]/)[0]
  else return event.locals.userConfig.language
}

export async function handle({ event, resolve }) {
  const config = await getConfig()
  if (config.demo_mode) {
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
    event.locals.sysConfig = config
    return resolve(event)
  } else {
    const userid = event.request.headers.get('Remote-User')
    if (userid && userid.length > 0) {
      event.locals.userConfig = await getUserConfig(userid)
      event.locals.user = {
        userid,
        email: event.request.headers.get('Remote-Email') || null,
        username: event.request.headers.get('Remote-Name') || null,
        groups: (event.request.headers.get('Remote-Groups') || '').split(/\s*,\s*/).filter(group => !!group),
        isAdmin: config.admin_userids.includes(userid),
        lang: getConfiguredUserLang(event)
      } as RequestUserInfo
      event.locals.sysConfig = config
      return resolve(event)
    } else {
      error(500, 'forward auth not configured')
    }
  }
}

async function onServerStartup() {
  await Promise.all([
    fs.promises.mkdir('/data/logos', { recursive: true }),
    fs.promises.mkdir('/data/users/backgrounds', { recursive: true }),
    fs.promises.mkdir('/data/users/config', { recursive: true }),
    (async () => {
      if (await isFile('/data/favicon.png')) await fs.promises.copyFile('/data/favicon.png', '/app/client/favicon.png')
    })()
  ])


  console.log('up and running')
}

await onServerStartup()
