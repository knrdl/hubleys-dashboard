<script lang="ts">
    import Fa from "svelte-fa";
    import {faCalendarCheck} from "@fortawesome/free-solid-svg-icons";

    export let calendar

    const isoNow = new Date().toISOString()//.split('T')[0] // todo

    function showEntry(entry) {
        return entry.dtstart >= isoNow || entry.dtend >= isoNow  //todo
    }
</script>

<ul class="text-sm">
    {#each calendar.entries.filter(showEntry) as entry}
        <li>{entry.dtstart}
            {#if entry.dtstart !== entry.dtend}
                -   {entry.dtend}
            {/if}
            / {entry.summary}</li>
        <!--        todo-->
    {:else}
        <Fa icon={faCalendarCheck} size="lg"/>
    {/each}
</ul>
