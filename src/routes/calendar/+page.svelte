<script lang="ts">
  import { getTodayDate, getTomorrowDate, getYesterdayDate, isSingleDayEvent, isTodayContained } from './utils'
  import Fa from 'svelte-fa'
  import { faCalendarCheck, faExclamationTriangle, faLocationDot } from '@fortawesome/free-solid-svg-icons'
  import type { PageData } from './$types'

  export let data: PageData

  const yesterdayDate = getYesterdayDate()
  const todayDate = getTodayDate()
  const tomorrowDate = getTomorrowDate()

  function fmtDate(date: string, relative: boolean = true) {
    const d = date.split('T')[0]
    if (relative && d === yesterdayDate) return 'yesterday'
    if (relative && d === todayDate) return 'today'
    if (relative && d === tomorrowDate) return 'tomorrow'
    if (date.includes('T'))
      return new Date(d).toLocaleDateString(data.userLang, {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    else
      return new Date(d).toLocaleDateString(data.userLang, {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      })
  }
</script>

<div class="z-10 max-w-xl rounded-lg border border-gray-200 bg-slate-100 px-6 py-3 shadow-md dark:border-gray-700 dark:bg-gray-800">
  {#if data.calendarEvents?.errors}
    <div class="mb-1 flex items-center gap-1 text-red-500">
      <Fa icon={faExclamationTriangle} />
      <span>Some calendars missing</span>
    </div>
  {/if}
  {#if data.calendarEvents?.entries && data.calendarEvents.entries.length > 0}
    <ol class="relative border-l border-gray-300 dark:border-gray-700">
      {#each data.calendarEvents.entries as entry}
        {@const containsToday = isTodayContained(entry)}
        <li class="mb-3 ml-4 first:pt-4 last:pb-4">
          <div
            class="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-400 dark:border-gray-900 dark:bg-gray-700"
            class:bg-blue-500={containsToday}
            class:dark:bg-blue-500={containsToday}
          ></div>
          <time
            class="mb-1 text-sm font-normal leading-none text-zinc-400 dark:text-zinc-400"
            title="from: {fmtDate(entry.dtstart, false)}, to: {fmtDate(entry.dtend, false)}"
          >
            {fmtDate(entry.dtstart)}
            {#if !isSingleDayEvent(entry)}
              - {fmtDate(entry.dtend)}
            {/if}
          </time>
          <span class="text-base font-bold text-gray-500 dark:text-gray-400">{entry.summary || entry.description}</span>
          {#if entry.location}
            <span class="ml-2 inline-flex items-start gap-1 text-gray-500 dark:text-gray-400">
              <Fa icon={faLocationDot} />
              {entry.location}
            </span>
          {/if}
          {#if entry.summary && entry.description}
            <p class="text-gray-500">{entry.description}</p>
          {/if}
        </li>
      {/each}
    </ol>
  {:else}
    <div class="mb-1 flex items-center gap-1 text-teal-400">
      <Fa icon={faCalendarCheck} />
      <span>No upcoming events</span>
    </div>
  {/if}
</div>

<style>
  time {
    font-variant-caps: petite-caps;
  }
</style>
