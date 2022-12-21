import {queryCalendar} from "$lib/server/calendar";

export const load: PageServerLoad = async ({locals}) => {
    return {
        calendarEvents: queryCalendar({user: locals.user}),
    }
}
