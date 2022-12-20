<script lang="ts">
    import Tile from "./Tile.svelte";
    import Searchbar from "./search/Widget.svelte";
    import CalendarWidget from "./calendar/Widget.svelte";

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

    {#if data.userConfig?.calendar.show && data.calendar}
        <section class="flex justify-center">
            <a href="/calendar"
               class="pl-3 pt-1 pr-2 pb-1 select-none bg-slate-900/80 hover:bg-slate-900 text-slate-100 rounded-bl-md">
                <CalendarWidget calendar={data.calendar}/>
            </a>
        </section>
    {/if}

    <section class="flex grow justify-center items-end">
        <div class="flex flex-wrap justify-center">
            {#each data.tiles as tile}
                <Tile {...tile}></Tile>
            {/each}
        </div>
    </section>
</main>
