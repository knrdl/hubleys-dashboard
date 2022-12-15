import {getConfig} from "./sysconfig"

function isUserAllowed(allowConditions: boolean | string[], user: RequestUserInfo) {
    if (allowConditions === true || allowConditions === false) return allowConditions
    if (Array.isArray(allowConditions))
        for (const cond of allowConditions) {
            let [condType, ...condValue] = cond.split(':')
            condValue = condValue.join(':')
            switch (condType.toLowerCase()) {
                case "user":
                    if (condValue === user.userid) return true
                    break
                case "email":
                case "mail":
                    if (!user.email) console.warn("User", user.userid, "has no email provided.")
                    else if (condValue === user.email) return true
                    break
                case "group":
                    if (user.groups.some(userGroup => userGroup === condValue)) return true
                    break
                default:
                    console.warn('unknown config option for allow:', condType)
            }
        }
    return false
}

export async function getUserCalendars(user: RequestUserInfo) {
    const config = await getConfig()
    return config.calendars
        .filter(tile => isUserAllowed(tile.allow, user))
        .map(origTile => {
            const tile = {...origTile}
            delete tile.allow
            return tile
        }) as Calendar[]
}

export async function getUserSearchEngines(user: RequestUserInfo) {
    const config = await getConfig()
    return config.search_engines
        .filter(tile => isUserAllowed(tile.allow, user))
        .map(origTile => {
            const tile = {...origTile}
            delete tile.allow
            return tile
        }) as SearchEngine[]
}

export async function getUserTiles(user: RequestUserInfo) {
    const config = await getConfig()
    return config.tiles
        .filter(tile => isUserAllowed(tile.allow, user))
        .map(origTile => {
            const tile = {...origTile}
            delete tile.allow
            tile.menu = tile.menu?.filter(menuItem => menuItem.allow === undefined || isUserAllowed(menuItem.allow, user)
            ).map(menuItemOrig => {
                const menuItem = {...menuItemOrig}
                delete menuItem.allow
                return menuItem
            }).sort((a, b,) => a.title.localeCompare(b.title))
            if (!(tile.menu?.length > 0))
                delete tile.menu
            return tile
        }) as Tile[]
}
