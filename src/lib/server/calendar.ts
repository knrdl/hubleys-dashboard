import ICAL from 'ical.js'
import {cache} from "$lib/server/httpcache";
import {getConfig} from "$lib/server/sysconfig";

export async function queryCalendar() {

    const config = await getConfig()
    const calendar = config.calendars[0] // todo
    const url = calendar.source_url
    if (cache(url)) return cache(url)

    const headers = (calendar.username && calendar.password) ?
        new Headers({'Authorization': `Basic ${btoa(calendar.username + ':' + calendar.password)}`}) :
        new Headers()

    const selectedDates = [-1, 0, 1, 2, 3].map(i => {
        const date = new Date()
        date.setDate(date.getDate() + i)
        return date.toISOString().split('T')[0]
    })

    const res = await fetch(url, {headers})
    if (res.status === 200) {
        const data = await res.text()
        const ical = ICAL.parse(data)
        const events = ical[2]
        const entries = events.filter(itm => itm[0] === 'vevent').map(itm => {
            const dtstart = itm[1].find(key => key[0] === 'dtstart')
            const dtend = itm[1].find(key => key[0] === 'dtend')
            const dtstamp = itm[1].find(key => key[0] === 'dtstamp')
            const summary = itm[1].find(key => key[0] === 'summary')
            return {
                dtstart: dtstart ? dtstart[3] : dtstamp[3],
                dtend: dtend ? dtend[3] : null,
                summary: summary ? summary[3] : '',
            }
        }).filter(itm => (
            selectedDates.some(day => itm.dtstart.startsWith(day)) ||
            selectedDates.some(day => itm.dtend?.startsWith(day))
        )).sort((a, b) => a.dtstart > b.dtstart ? 1 : -1)
        return cache(url, {entries, display_url: calendar.display_url})  // todo: multiple display_urls for multiple calendars
    } else {
        throw new Error('weather error: ' + (await res.text()))
    }
}
