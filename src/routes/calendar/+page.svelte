<script lang="ts">
  import Fa from 'svelte-fa'
  import { faCalendarCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
  import type { PageData } from './$types'
  import { t } from '$lib/translations'
  import CalendarList from './CalendarList.svelte'

  export let data: PageData
</script>

<div class="z-10 max-w-xl rounded-lg border border-gray-200 bg-slate-100 px-6 py-3 shadow-md dark:border-gray-700 dark:bg-gray-800">
  {#if data.calendarEvents?.errors}
    <div class="mb-1 flex items-center gap-1 text-red-500">
      <Fa icon={faExclamationTriangle} />
      <span>{$t('calendar.msg.missing-calendars')}</span>
    </div>
  {/if}
  {#if data.calendarEvents?.entries && data.calendarEvents.entries.length > 0}
    <CalendarList calendarEvents={data.calendarEvents} userLang={data.userLang} compactMode={false} />
  {:else}
    <div class="mb-1 flex items-center gap-1 text-teal-400">
      <Fa icon={faCalendarCheck} />
      <span>{$t('calendar.msg.no-events')}</span>
    </div>
  {/if}
</div>
