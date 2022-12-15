<script lang="ts">
    import Fa from 'svelte-fa'
    import {
        faEllipsisV,
        faCircleQuestion,
        faExpand,
        faFolderOpen,
        faPlus,
    } from '@fortawesome/free-solid-svg-icons'
    import TileFolder from "./TileFolder.svelte";

    export let title: string
    export let emoji: string | undefined = undefined
    export let logo: string | undefined = undefined
    export let url: string | undefined = undefined
    export let display: undefined | 'icon-only' = undefined // todo type
    export let menu: {
        title: string
        url: string
        logo?: string
        emoji?: string
    }[] | undefined = undefined  // todo

    let tileMenuCoords = null

    function onMoreClick(ev: MouseEvent) {
        tileMenuCoords = {x: ev.x, y: ev.y}
    }

    let tileFolderCoords = null

    function onTileClick(ev: MouseEvent) {
        if (!url) {
            ev.preventDefault()
            tileFolderCoords = {x: ev.x, y: ev.y}
        }
    }
</script>

<!--todo: remove the duplication tileFolderCoords tileMenuCoords-->
{#if tileFolderCoords}
    <TileFolder clickX={tileFolderCoords.x} clickY={tileFolderCoords.y} on:close={()=>tileFolderCoords=null} {menu}
                folderTitle={title}/>
{/if}

{#if tileMenuCoords}
    <TileFolder clickX={tileMenuCoords.x} clickY={tileMenuCoords.y} on:close={()=>tileMenuCoords=null} {menu}
                folderTitle={title}/>
{/if}


<a href={url || '#'} target="_blank" rel="noopener noreferrer" class="card
group relative
flex flex-col justify-center
m-2 p-1 rounded-md shadow-md no-underline
bg-gradient-to-br from-gray-700/90 via-slate-600/90 to-zinc-700/90
hover:bg-gradient-to-tr hover:from-teal-600/90 hover:via-sky-700/90 hover:to-indigo-700/90
hover:scale-110 transition-transform ease-in-out
" on:click={onTileClick}>
    {#if menu}
        {#if url}
            <button on:click|preventDefault={onMoreClick}
                    class="
                    absolute -top-1 -right-1 w-8 h-8
                    inline-flex justify-center items-center
                    text-xs text-slate-100 font-bold
                    rounded-lg
                    group-hover:scale-110 transition-transform ease-in-out group-hover:text-white
                    hover:bg-slate-900/80
                        ">
                <Fa icon={faEllipsisV}/>
            </button>
        {:else}
            <div class="
                absolute -top-1 -right-1 w-8 h-8
                inline-flex justify-center items-center
                text-xs font-bold text-slate-400 group-hover:text-slate-200
            ">
                <Fa icon={faPlus}/>
            </div>
        {/if}
    {/if}
    <div {title} class="flex justify-center items-center text-4xl h-12 text-stone-200">
        {#if logo}
            <img src="logos/{logo}" alt={title.split(/\s/)[0]} class="max-w-full max-h-full"/>
        {:else if emoji}
            <span>{emoji}</span>
        {:else if url}
            <Fa icon={faCircleQuestion}/>
        {:else}
            {#if menu.some((itm, idx) => idx < 4 && (itm.logo || itm.emoji))}
                <div class="inline-grid gap-1 text-xl" class:grid-cols-2={menu.length>1}
                     class:grid-rows-2={menu.length>2}>
                    {#each menu as item, index}
                        {#if index < 4}
                            <div class:col-span-2={index === menu.length -1 && index%2===0} class="flex justify-center">
                                <div class="w-6 h-6 flex justify-center items-center">
                                    {#if item.logo}
                                        <img src="logos/{item.logo}" alt={item.title} class="max-w-full max-h-full"/>
                                    {:else if item.emoji}
                                        <span>{item.emoji}</span>
                                    {:else}
                                        <Fa icon={faExpand}/>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            {:else}
                <Fa icon={faFolderOpen}/>
            {/if}
        {/if}
    </div>
    {#if display !== 'icon-only'}
        <span class="leading-5 overflow-hidden text-center text-slate-300 mt-1">{title}</span>
    {/if}
</a>

<style>
    :root {
        --height: 90px;
    }

    .card {
        width: calc(var(--height) * 1.618);
        height: var(--height);
    }
</style>
