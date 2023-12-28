import { queryCalendar } from '$lib/server/calendar'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  return {
    calendarEvents: await queryCalendar({ user: locals.user, failfast: false })
  }
}
