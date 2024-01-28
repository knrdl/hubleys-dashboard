<script lang="ts">
  import Fa from 'svelte-fa'
  import { faCalendarCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
  import { onDestroy, onMount } from 'svelte'
  import { epoch } from '$lib/utils'
  import type { CalendarEntry } from './types'
  import { t } from '$lib/translations'
  import CalendarList from './CalendarList.svelte'

  export let calendarEvents: { errors: boolean; entries: CalendarEntry[] }
  export let userLang: string

  let lastUpdate: number
  let updateInterval: number

  function update() {
    window
      .fetch('/calendar/entries')
      .then(res => res.json())
      .then(data => {
        calendarEvents = data
        lastUpdate = epoch()
      })
  }

  onMount(() => {
    updateInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && epoch() - lastUpdate > 5 * 60) update() // todo: make 5min configurable
    }, 10_000) as unknown as number
    if (!calendarEvents || calendarEvents.errors) {
      update()
    }
  })

  onDestroy(() => {
    clearInterval(updateInterval)
  })
</script>

{#if calendarEvents?.errors}
  <div class="mb-1 flex items-center gap-1 text-orange-500">
    <Fa icon={faExclamationTriangle} />
    <span>{$t('calendar.msg.missing-calendars')}</span>
  </div>
{/if}
{#if calendarEvents?.entries?.length > 0}
  <CalendarList {calendarEvents} {userLang} compactMode={true} />
{:else if !calendarEvents?.errors}
  <div class="mb-1 flex items-center gap-1 text-teal-400">
    <Fa icon={faCalendarCheck} />
    <span>{$t('calendar.msg.no-events')}</span>
  </div>
{/if}
