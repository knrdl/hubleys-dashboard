<script lang="ts">
    import Fa from "svelte-fa";
    import {faCalendarCheck, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";

    export let calendarEvents: { errors: boolean, entries: CalendarEntry[] }
    export let userLang: string

    const todayDate = new Date().toISOString().split('T')[0]
    const tomorrowDate = (() => {
        const dat = new Date()
        dat.setDate(new Date().getDate() + 1)
        return dat.toISOString().split('T')[0]
    })()

    function isSingleDayEvent(entry: CalendarEntry) {
        if (!entry.dtstart || entry.dtstart.includes('T')) return false
        if (!entry.dtend || entry.dtend.includes('T')) return false
        const dat = new Date(entry.dtstart)
        dat.setDate(dat.getDate() + 1)
        return dat.toISOString().split('T')[0] === entry.dtend
    }

    function isTodayContained(entry: CalendarEntry) {
        const today = new Date().toISOString().split('T')[0]
        const start = entry.dtstart?.split('T')[0]
        const stop = entry.dtend?.split('T')[0]
        return start <= today && stop >= today
    }

    function fmtDate(date: string, relative: boolean = true) {
        const d = date.split('T')[0]
        if (relative && d === todayDate) return 'today'
        if (relative && d === tomorrowDate) return 'tomorrow'
        if (date.includes('T'))
            return new Date(d).toLocaleDateString(userLang, {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        else
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
    <div class="flex items-center gap-1 mb-1 text-red-500">
        <Fa icon={faExclamationTriangle}/>
        <span>Some calendars missing</span>
    </div>
{/if}
{#if calendarEvents?.entries?.length >= 5}
    <ol class="relative border-l border-gray-200 dark:border-gray-700">
        {#each calendarEvents?.entries as entry, idx}
            {#if idx < 5}
                {@const containsToday = isTodayContained(entry)}
                <li class="ml-4">
                    <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"
                         class:bg-blue-500={containsToday} class:dark:bg-blue-500={containsToday}></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
                          title="from: {fmtDate(entry.dtstart, false)}, to: {fmtDate(entry.dtend, false)}">
                        {fmtDate(entry.dtstart)}
                        {#if !isSingleDayEvent(entry)}
                            - {fmtDate(entry.dtend)}
                        {/if}
                    </time>
                    <span class="text-base font-normal text-gray-500 dark:text-gray-400">{entry.summary || entry.description}</span>
                </li>
            {/if}
        {/each}
    </ol>
{:else}
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
