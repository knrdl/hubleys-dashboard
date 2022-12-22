<script lang="ts">
    import Fa from "svelte-fa";
    import {faCalendarCheck, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
    import {getTodayDate, getTomorrowDate, getYesterdayDate, isSingleDayEvent, isTodayContained} from "./utils";

    export let calendarEvents: { errors: boolean, entries: CalendarEntry[] }
    export let userLang: string

    const yesterdayDate = getYesterdayDate()
    const todayDate = getTodayDate()
    const tomorrowDate = getTomorrowDate()

    function fmtDate(date: string, {relative, startDate}: { relative?: boolean, startDate?: string } = {
        relative: true, startDate: null
    }) {
        const d = date.split('T')[0]
        if (relative && d === yesterdayDate) return 'yesterday'
        if (relative && d === todayDate) return 'today'
        if (relative && d === tomorrowDate) return 'tomorrow'
        if (date.includes('T')) {
            if (startDate && d === startDate.split('T')[0]) // event starts and ends at same day
                return new Date(date).toLocaleTimeString(userLang, {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            else
                return new Date(date).toLocaleDateString(userLang, {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
        } else
            return new Date(d).toLocaleDateString(userLang, {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
            })
    }

    $: { // this could be handled in onMount but then config changes would not be applied as live reload
        if (typeof window !== "undefined" && (!calendarEvents || calendarEvents.errors))
            window.fetch('/calendar/entries').then(res => res.json()).then(data => {
                calendarEvents = data
            })
    }

</script>

{#if calendarEvents?.errors}
    <div class="flex items-center gap-1 mb-1 text-orange-500">
        <Fa icon={faExclamationTriangle}/>
        <span>Some calendars missing</span>
    </div>
{/if}
{#if calendarEvents?.entries?.length > 0}
    <ol class="relative border-l border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-500">
        {#each calendarEvents?.entries as entry, idx}
            {#if idx < 5}
                {@const containsToday = isTodayContained(entry)}
                <li class="ml-4">
                    <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-500 dark:bg-gray-700"
                         class:bg-blue-500={containsToday} class:dark:bg-blue-500={containsToday}></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-500 dark:text-gray-500"
                          title="from: {fmtDate(entry.dtstart, {relative: false})}, to: {fmtDate(entry.dtend, {relative: false})}">
                        {fmtDate(entry.dtstart)}
                        {#if !isSingleDayEvent(entry)}
                            - {fmtDate(entry.dtend, {startDate: entry.dtstart})}
                        {/if}
                    </time>
                    <span class="text-base font-normal text-gray-600 dark:text-gray-400">{entry.summary || entry.description}</span>
                </li>
            {/if}
        {/each}
    </ol>
{:else if !calendarEvents?.errors}
    <div class="flex items-center gap-1 mb-1 text-teal-400">
        <Fa icon={faCalendarCheck}/>
        <span>No upcoming events</span>
    </div>
{/if}

<style>
    time {
        font-variant-caps: petite-caps;
    }
</style>
