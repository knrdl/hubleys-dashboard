<script lang="ts">
    import Tile from "./Tile.svelte";
    import Searchbar from "$lib/widgets/Searchbar.svelte";

    export let data: PageData
</script>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>


<main class="flex flex-col grow p-3 w-full max-w-screen-lg">

    {#if data.userConfig?.searchbar.show}
        <section class="flex justify-center">
            <Searchbar engines={data.search_engines}/>
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
