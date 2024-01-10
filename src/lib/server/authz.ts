import { sysConfig } from './sysconfig'
import type { AccessRule, Calendar, Message, SearchEngine, Section, SysconfigTile } from './sysconfig/types'
import type { RequestUserInfo } from './types'

function isUserAllowed(allowRule: AccessRule | undefined, denyRule: AccessRule | undefined, user: RequestUserInfo) {
  if (denyRule === true || allowRule === false) return false

  function matchesRuleList(rule: AccessRule | undefined) {
    if (typeof rule === 'undefined') return false
    if (!Array.isArray(rule)) throw new Error('this function only checks rule lists')
    for (const cond of rule) {
      const [condType, ...rest] = cond.split(':')
      const condValue = rest.join(':')
      switch (condType.toLowerCase()) {
        case 'user':
          if (condValue === user.userid) return true
          break
        case 'username':
          if (condValue === user.username) return true
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
          console.warn('unknown config option for allow/deny:', condType)
      }
    }
    return false
  }

  return (allowRule === true || matchesRuleList(allowRule)) && (!denyRule || !matchesRuleList(denyRule))
}

function transformTiles(tiles: SysconfigTile[], user: RequestUserInfo, level = 0) {
  return (tiles || [])
    .filter(tile => isUserAllowed(tile.allow ?? level > 0, tile.deny, user))
    .map(async tile => {
      if (tile.menu && tile.menu.tiles && tile.menu.tiles.length > 0) {
        if (isUserAllowed(tile.menu.allow ?? tile.allow ?? level > 0, tile.menu.deny, user))
          tile.menu.tiles = await Promise.all(transformTiles(tile.menu.tiles, user, level + 1))
        else tile.menu.tiles = []
      }
      if (!tile.menu || !tile.menu.tiles || tile.menu.tiles.length === 0) delete tile.menu
      delete tile.allow
      delete tile.deny
      return tile
    })
}

export async function getUserCalendars(user: RequestUserInfo) {
  return structuredClone(sysConfig.calendars || [])
    .filter(cal => isUserAllowed(cal.allow, cal.deny, user))
    .map(cal => {
      delete cal.allow
      delete cal.deny
      return cal
    }) as Calendar[]
}

export async function getUserSearchEngines(user: RequestUserInfo) {
  return structuredClone(sysConfig.search_engines || [])
    .filter(engine => isUserAllowed(engine.allow, engine.deny, user))
    .map(engine => {
      delete engine.allow
      delete engine.deny
      return engine
    }) as SearchEngine[]
}

export async function getUserSections(user: RequestUserInfo): Promise<Section[]> {
  return (
    await Promise.all(
      structuredClone(sysConfig.sections)
        .filter(section => isUserAllowed(section.allow, section.deny, user))
        .map(async section => {
          section.tiles = await Promise.all(transformTiles(structuredClone(section.tiles || []), user))
          delete section.allow
          delete section.deny
          return section
        })
    )
  ).filter(section => section.tiles.length > 0)
}

export async function getUserMessages(user: RequestUserInfo): Promise<Message[]> {
  return structuredClone(sysConfig.messages || [])
    .filter(msg => isUserAllowed(msg.allow, msg.deny, user))
    .map(msg => {
      delete msg.allow
      delete msg.deny
      return msg
    }) as Message[]
}
