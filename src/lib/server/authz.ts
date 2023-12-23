import { getSysConfig } from './sysconfig'
import path from 'path'
import { isFile } from '$lib/server/fs'
import { dev } from '$app/environment'

function isUserAllowed(allowConditions: boolean | string[] | undefined, user: RequestUserInfo) {
  if (allowConditions === true || allowConditions === false) return allowConditions
  if (typeof allowConditions === 'undefined') return false
  if (Array.isArray(allowConditions))
    for (const cond of allowConditions) {
      const [condType, ...rest] = cond.split(':')
      const condValue = rest.join(':')
      switch (condType.toLowerCase()) {
        case 'user':
          if (condValue === user.userid) return true
          break
        case 'email':
        case 'mail':
          if (!user.email) console.warn('User', user.userid, 'has no email provided.')
          else if (condValue === user.email) return true
          break
        case 'group':
          if (user.groups.some(userGroup => userGroup === condValue)) return true
          break
        default:
          console.warn('unknown config option for allow:', condType)
      }
    }
  return false
}

export async function getUserCalendars(user: RequestUserInfo) {
  const config = await getSysConfig()
  return (config.calendars || [])
    .filter(tile => isUserAllowed(tile.allow, user))
    .map(origTile => {
      const tile = { ...origTile }
      delete tile.allow
      return tile
    }) as Calendar[]
}

export async function getUserSearchEngines(user: RequestUserInfo) {
  const config = await getSysConfig()
  return (config.search_engines || [])
    .filter(tile => isUserAllowed(tile.allow, user))
    .map(origTile => {
      const tile = { ...origTile }
      delete tile.allow
      return tile
    }) as SearchEngine[]
}

async function logo2url(logo?: string) {
  if (logo) {
    if (logo.match(/^https?:\/\/.+/)) {
      return logo
    } else {
      const filename = path.basename(logo)
      const basepath = dev ? 'static' : 'client'
      const job1 = isFile(basepath + '/logos/' + filename)
      const job2 = isFile(basepath + '/fallback-logos/' + filename)
      if (await job1) return 'logos/' + filename
      if (await job2) return 'fallback-logos/' + filename
      console.warn(`Logo file "${logo}" could not be found, ignoring image.`)
    }
  }
}

export async function getUserTiles(user: RequestUserInfo): Promise<Tile[]> {
  const transformTiles = (tiles: SysconfigTile[], level = 0) =>
    tiles
      ?.filter(tile => isUserAllowed(tile.allow, user) || (level > 0 && tile.allow === undefined))
      .map(async origTile => {
        const tile = { ...origTile }
        delete tile.allow
        if (tile.menu) tile.menu = await Promise.all(transformTiles(tile.menu, level + 1))
        if (tile.menu && tile.menu.length > 0)
          await Promise.all(
            tile.menu.map(async menuItem => {
              menuItem.logo = await logo2url(menuItem.logo)
              return menuItem
            })
          )
        else delete tile.menu
        tile.logo = await logo2url(tile.logo)
        return tile
      })

  const config = await getSysConfig()

  if (config.tiles) return Promise.all(transformTiles(config.tiles))
  else return []
}

export async function getUserMessages(user: RequestUserInfo): Promise<Message[]> {
  const config = await getSysConfig()
  return (config.messages || [])
    .filter(msg => isUserAllowed(msg.allow, user))
    .map(origMsg => {
      const msg = { ...origMsg }
      delete msg.allow
      return msg
    }) as Message[]
}
