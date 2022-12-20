<script lang="ts">
    import Tile from "./Tile.svelte";
    import Searchbar from "./search/Widget.svelte";
    import CalendarWidget from "./calendar/Widget.svelte";
    import {fly} from 'svelte/transition';

    export let data: PageData
</script>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>


<main class="flex flex-col grow p-3 w-full max-w-screen-lg">

    {#if data.userConfig?.searchbar.show && data.searchEngines}
        <section class="flex justify-center">
            <Searchbar engines={data.searchEngines}/>
        </section>
    {/if}

    {#if data.userConfig?.calendar.show}
        <section class="flex justify-center mt-3">
            <a href="/calendar"
               class="pl-3 pt-1 pr-2 pb-1 select-none bg-slate-900/80 hover:bg-slate-900 text-slate-100 rounded-md z-[10]">
                <CalendarWidget calendarEvents={data.calendarEvents} userLang={data.userLang}/>
            </a>
        </section>
    {/if}

    <section class="flex grow justify-center items-end">
        <div class="flex flex-wrap justify-center" in:fly={{y:20}}>
            {#each data.tiles as tile}
                <Tile {...tile}></Tile>
            {/each}
        </div>
    </section>
</main>
