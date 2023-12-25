import type { CalendarEntry } from './types'

export const getYesterdayDate = () => {
  const dat = new Date()
  dat.setDate(new Date().getDate() - 1)
  return dat.toISOString().split('T')[0]
}
export const getTodayDate = () => new Date().toISOString().split('T')[0]
export const getTomorrowDate = () => {
  const dat = new Date()
  dat.setDate(new Date().getDate() + 1)
  return dat.toISOString().split('T')[0]
}

export function isTodayContained(entry: CalendarEntry) {
  const today = getTodayDate()
  const start = entry.dtstart?.split('T')[0]
  if (isSingleDayEvent(entry)) return start === today
  const stop = entry.dtend?.split('T')[0]
  return start <= today && stop >= today
}

export function isSingleDayEvent(entry: CalendarEntry) {
  if (!entry.dtstart || entry.dtstart.includes('T')) return false
  if (!entry.dtend || entry.dtend.includes('T')) return false
  const dat = new Date(entry.dtstart)
  dat.setDate(dat.getDate() + 1)
  return dat.toISOString().split('T')[0] === entry.dtend
}
