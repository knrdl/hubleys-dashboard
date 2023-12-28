import { json } from '@sveltejs/kit'
import { queryCalendar } from '$lib/server/calendar'

export async function GET({ locals }) {
  return json(await queryCalendar({ user: locals.user, failfast: false }))
}
