import { getSysConfig } from './sysconfig'
import type { AccessRule, Calendar, Message, SearchEngine, SysconfigTile, Tile } from './sysconfig/types'
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

export async function getUserCalendars(user: RequestUserInfo) {
  const config = await getSysConfig()
  return structuredClone(config.calendars || [])
    .filter(cal => isUserAllowed(cal.allow, cal.deny, user))
    .map(cal => {
      delete cal.allow
      delete cal.deny
      return cal
    }) as Calendar[]
}

export async function getUserSearchEngines(user: RequestUserInfo) {
  const config = await getSysConfig()
  return structuredClone(config.search_engines || [])
    .filter(engine => isUserAllowed(engine.allow, engine.deny, user))
    .map(engine => {
      delete engine.allow
      delete engine.deny
      return engine
    }) as SearchEngine[]
}

export async function getUserTiles(user: RequestUserInfo): Promise<Tile[]> {
  const transformTiles = (tiles: SysconfigTile[], level = 0) =>
    tiles
      ?.filter(tile => isUserAllowed(tile.allow ?? level > 0, tile.deny, user))
      .map(async tile => {
        if (tile.menu && tile.menu.tiles.length > 0) {
          if (isUserAllowed(tile.menu.allow ?? tile.allow ?? level > 0, tile.menu.deny, user))
            tile.menu.tiles = await Promise.all(transformTiles(tile.menu.tiles, level + 1))
          else tile.menu.tiles = []
        }
        if (!tile.menu || tile.menu.tiles.length === 0) delete tile.menu
        delete tile.allow
        delete tile.deny
        return tile
      })

  const config = await getSysConfig()
  if (config.tiles) return Promise.all(transformTiles(structuredClone(config.tiles)))
  else return []
}

export async function getUserMessages(user: RequestUserInfo): Promise<Message[]> {
  const config = await getSysConfig()
  return structuredClone(config.messages || [])
    .filter(msg => isUserAllowed(msg.allow, msg.deny, user))
    .map(msg => {
      delete msg.allow
      delete msg.deny
      return msg
    }) as Message[]
}
