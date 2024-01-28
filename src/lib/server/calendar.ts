import ICAL from 'ical.js'
import cache from '$lib/server/httpcache'
import { getUserCalendars } from '$lib/server/authz'
import { fetchTimeout } from '$lib/server/fetch'
import type { CalendarEntry } from '../../routes/calendar/types'
import type { RequestUserInfo } from './types'

async function calFetch({ url, failfast }: { url: string; failfast: boolean }) {
  const parsedUrl = new URL(url)
  const headers =
    parsedUrl.username && parsedUrl.password ? new Headers({ Authorization: `Basic ${btoa(parsedUrl.username + ':' + parsedUrl.password)}` }) : new Headers()
  parsedUrl.username = ''
  parsedUrl.password = ''

  const res = await fetchTimeout(parsedUrl, { headers, redirect: 'follow', failfast })
  const txt = await res.text()
  if (res.ok) {
    const ical = ICAL.parse(txt)
    const entries: [string, [string, string, string, string][]][] = ical[2]
    return entries
      .filter(itm => itm[0] === 'vevent')
      .map(itm => {
        const dtstart = itm[1].find(key => key[0] === 'dtstart')
        const dtend = itm[1].find(key => key[0] === 'dtend')
        const summary = itm[1].find(key => key[0] === 'summary')
        const location = itm[1].find(key => key[0] === 'location')
        const description = itm[1].find(key => key[0] === 'description')
        return {
          dtstart: dtstart ? dtstart[3] : null,
          dtend: dtend ? dtend[3] : null,
          summary: summary ? summary[3] : '',
          location: location ? location[3] : '',
          description: description ? description[3] : ''
        } as CalendarEntry
      })
  } else {
    throw new Error('Calendar error: ' + txt)
  }
}

export async function queryCalendar({ user, failfast }: { user: RequestUserInfo; failfast: boolean }) {
  const calendars = getUserCalendars(user)

  if (calendars?.length > 0) {
    const calData = await Promise.allSettled(
      calendars.map(async cal => {
        if (cache.has(cal.url)) return cache.get<CalendarEntry[]>(cal.url)
        else return cache.set(cal.url, await calFetch({ url: cal.url, failfast }))
      })
    )

    const dateJump = (dayDiff: number) => {
      const date = new Date()
      date.setDate(date.getDate() + dayDiff)
      return date.toISOString().split('T')[0]
    }

    const filterDateFrom = dateJump(-1) // include yesterday because of timezone shifts
    const filterDateTo = dateJump(31)

    const results: CalendarEntry[] = []
    let errors = false

    for (const calResult of calData) {
      if (calResult.status === 'fulfilled') {
        for (const entry of calResult.value) {
          const dtStartDate = entry.dtstart?.split('T')[0]
          const dtEndDate = entry.dtend?.split('T')[0]

          const containsStart = dtStartDate && dtStartDate >= filterDateFrom && dtStartDate <= filterDateTo
          const containsEnd = dtEndDate && dtEndDate >= filterDateFrom && dtEndDate <= filterDateTo
          const containsWhole = dtStartDate && dtEndDate && dtStartDate <= filterDateFrom && dtEndDate >= filterDateTo

          if (containsStart || containsEnd || containsWhole) {
            results.push(entry)
          }
        }
      } else {
        errors = true
        console.error(`Error loading calendar: ${calResult.reason}`)
      }
    }
    return {
      entries: results.sort((a, b) => a.dtstart?.localeCompare(b.dtstart) || a.dtend?.localeCompare(b.dtend) || a.summary?.localeCompare(b.summary)),
      errors
    }
  } else {
    return null
  }
}
