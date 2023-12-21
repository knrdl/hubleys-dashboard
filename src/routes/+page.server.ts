import { getUserSearchEngines, getUserTiles } from '$lib/server/authz'
import { queryCalendar } from '$lib/server/calendar'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  return {
    tiles: await getUserTiles(locals.user),
    calendarEvents: await queryCalendar({
      user: locals.user,
      timeout: locals.sysConfig.server_request_timeout
    }), // loaded from here or /calendar/entries on timeout
    searchEngines: await getUserSearchEngines(locals.user)
  }
}
