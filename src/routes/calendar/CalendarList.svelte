<script lang="ts">
  import Fa from 'svelte-fa'
  import type { CalendarEntry } from './types'
  import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
  import { t } from '$lib/translations'

  export let calendarEvents: { errors: boolean; entries: CalendarEntry[] }
  export let userLang: string
  export let compactMode: boolean = false

  function isSingleDayEvent(entry: CalendarEntry) {
    if (!entry.dtstart || !entry.dtend) return false
    if (entry.dtstart.includes('T') || entry.dtend.includes('T')) return entry.dtstart.split('T')[0] === entry.dtend.split('T')[0]
    const dat = new Date(entry.dtstart)
    dat.setDate(dat.getDate() + 1)
    return dat.toISOString().split('T')[0] === entry.dtend
  }

  function isTodayContained(entry: CalendarEntry) {
    const today = dateJump(0)
    const start = entry.dtstart?.split('T')[0]
    if (isSingleDayEvent(entry)) return start === today
    const stop = entry.dtend?.split('T')[0]
    return start <= today && stop >= today
  }

  function fmtDate(dt: string) {
    if (!dt) return ''
    else if (dt.includes('T'))
      return new Date(dt).toLocaleDateString(userLang, {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    else return new Date(dt).toLocaleDateString(userLang, { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const dateJump = (dayDiff: number) => {
    const date = new Date()
    date.setDate(date.getDate() + dayDiff)
    return date.toISOString().split('T')[0]
  }
</script>

<ol class="relative border-l-2 border-gray-200 group-hover:border-gray-300 dark:border-gray-700 dark:group-hover:border-gray-500">
  {#each calendarEvents?.entries as entry, idx}
    {#if idx < 5 || !compactMode}
      {@const containsToday = isTodayContained(entry)}
      <li class="ml-4" class:mb-3={!compactMode} class:first:pt-4={!compactMode} class:last:pb-4={!compactMode}>
        <div
          class="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border border-white dark:border-gray-500"
          class:bg-blue-500={containsToday}
          class:dark:bg-blue-500={containsToday}
          class:bg-gray-200={!containsToday}
          class:dark:bg-gray-700={!containsToday}
          title={containsToday ? $t('calendar.relevant-today') : undefined}
        ></div>
        <time
          class="mb-1 text-sm leading-none font-normal text-gray-500 dark:text-gray-500"
          datetime={entry.dtstart || entry.dtend}
          title="{$t('calendar.from')} {fmtDate(entry.dtstart)} {$t('calendar.to')} {fmtDate(entry.dtend || entry.dtstart)}"
        >
          {#if isSingleDayEvent(entry)}
            {@const date = (entry.dtstart || entry.dtend).split('T')[0]}
            {#if date === dateJump(-1)}
              {$t('calendar.yesterday')}
            {:else if date === dateJump(0)}
              {$t('calendar.today')}
            {:else if date === dateJump(1)}
              {$t('calendar.tomorrow')}
            {:else}
              {new Date(entry.dtstart).toLocaleDateString(userLang, { weekday: 'short', day: '2-digit', month: '2-digit' })}
            {/if}
            {#if entry.dtstart?.includes('T') && entry.dtend?.includes('T')}
              {new Date(entry.dtstart).toLocaleTimeString(userLang, { hour: '2-digit', minute: '2-digit' })} &ndash;
              {new Date(entry.dtend).toLocaleTimeString(userLang, { hour: '2-digit', minute: '2-digit' })}
            {/if}
          {:else if entry.dtstart?.includes('T') && entry.dtend?.includes('T')}
            {new Date(entry.dtstart).toLocaleDateString(userLang, {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
            &ndash;
            {new Date(entry.dtend).toLocaleDateString(userLang, {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          {:else}
            {new Date(entry.dtstart).toLocaleDateString(userLang, { weekday: 'short', day: '2-digit', month: '2-digit' })} &ndash;
            {new Date(entry.dtend).toLocaleDateString(userLang, { weekday: 'short', day: '2-digit', month: '2-digit' })}
          {/if}
        </time>
        <span class="text-base text-gray-600 dark:text-gray-400" class:font-semibold={!compactMode}>
          {entry.summary || entry.description}
        </span>
        {#if !compactMode}
          {#if entry.location}
            <span class="ml-2 inline-flex items-start gap-1 text-gray-500 dark:text-gray-400">
              <Fa icon={faLocationDot} />
              {entry.location}
            </span>
          {/if}
          {#if entry.summary && entry.description}
            <p class="text-gray-500">{entry.description}</p>
          {/if}
        {/if}
      </li>
    {/if}
  {/each}
</ol>

<style>
  time {
    font-variant-caps: petite-caps;
  }
</style>
