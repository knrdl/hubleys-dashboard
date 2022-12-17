<script lang="ts">
    import {scale} from 'svelte/transition';
    import {createEventDispatcher} from "svelte";
    import Tile from "./Tile.svelte";

    const dispatch = createEventDispatcher()
    export let clickX: number = 0
    export let clickY: number = 0

    export let menu
    export let folderTitle: string

    let dialogWidth: number = 0, dialogHeight: number = 0
    let windowWidth: number = 0, windowHeight: number = 0
    let leftPos: number
    let topPos: number

    function keydown(e: KeyboardEvent) {
        if (e.key === "Escape")
            dispatch('close')
    }

    const pad = 10  // pixels
    $: {
        const px = windowWidth - dialogWidth > pad ? pad : 0
        const py = windowHeight - dialogHeight > pad ? pad : 0
        leftPos = Math.max(px, Math.min(clickX - Math.floor(dialogWidth / 2), windowWidth - dialogWidth - px))
        topPos = Math.max(py, Math.min(clickY - Math.floor(dialogHeight / 2), windowHeight - dialogHeight - py))
    }

</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} on:keydown={keydown}/>

<div class="fixed top-0 left-0 bottom-0 right-0 z-[1000]" on:click|stopPropagation={()=>dispatch('close')}
     on:keydown={keydown}>
    <div class="absolute p-3 bg-gray-100/95 border border-gray-200 rounded-lg shadow-xl dark:bg-gray-900/95 dark:border-gray-700"
         bind:clientWidth={dialogWidth} bind:clientHeight={dialogHeight} style="left: {leftPos}px; top: {topPos}px"
         transition:scale={{duration: 200 }}>
        <h1 class="text-center text-2xl mb-3 text-gray-900 dark:text-gray-100 select-none">{folderTitle}</h1>
        <div class="inline-grid gap-1" class:grid-cols-2={menu.length>1}
             class:grid-rows-2={menu.length>2}>
            {#each menu as item, idx}
                <div class:col-span-2={idx === menu.length -1 && idx%2===0} class="flex justify-center">
                    <Tile {...item}/>
                </div>
            {/each}
        </div>
    </div>
</div>
