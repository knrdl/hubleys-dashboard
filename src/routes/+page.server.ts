import { getUserMessages, getUserSearchEngines, getUserTiles } from '$lib/server/authz'
import { queryCalendar } from '$lib/server/calendar'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  return {
    tiles: await getUserTiles(locals.user),
    calendarEvents: await queryCalendar({ user: locals.user, failfast: true }), // loaded from here or /calendar/entries on timeout
    searchEngines: await getUserSearchEngines(locals.user),
    messages: await getUserMessages(locals.user)
  }
}
