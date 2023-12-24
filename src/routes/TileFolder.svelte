<script lang="ts">
  import { scale } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import Tile from './Tile.svelte'
  import type { Tile as TileType } from '$lib/server/sysconfig/types'

  const dispatch = createEventDispatcher()
  export let clickX: number = 0
  export let clickY: number = 0

  export let menu: TileType['menu']

  let dialogWidth: number = 0,
    dialogHeight: number = 0
  let windowWidth: number = 0,
    windowHeight: number = 0
  let leftPos: number
  let topPos: number

  function keydown(e: KeyboardEvent) {
    if (e.key === 'Escape') dispatch('close')
  }

  const pad = 10 // pixels
  $: {
    const px = windowWidth - dialogWidth > pad ? pad : 0
    const py = windowHeight - dialogHeight > pad ? pad : 0
    leftPos = Math.max(px, Math.min(clickX - Math.floor(dialogWidth / 2), windowWidth - dialogWidth - px))
    topPos = Math.max(py, Math.min(clickY - Math.floor(dialogHeight / 2), windowHeight - dialogHeight - py))
  }
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} on:keydown={keydown} />

<div class="fixed bottom-0 left-0 right-0 top-0 z-[1000]" on:click|stopPropagation={() => dispatch('close')} on:keydown={keydown}>
  <div
    class="absolute rounded-lg border border-gray-200 bg-gray-100/75 p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900/95"
    bind:clientWidth={dialogWidth}
    bind:clientHeight={dialogHeight}
    style="left: {leftPos}px; top: {topPos}px"
    transition:scale={{ duration: 200 }}
  >
    <h1 class="mb-3 select-none text-center text-2xl text-gray-900 dark:text-gray-100">
      {folderTitle}
    </h1>
    <div class="inline-grid gap-1" class:grid-cols-2={menu?.length > 1} class:grid-rows-2={menu?.length > 2}>
      {#each menu || [] as item, idx}
        <div class:col-span-2={idx === menu.length - 1 && idx % 2 === 0} class="flex justify-center">
          <Tile {...item} />
        </div>
      {/each}
    </div>
  </div>
</div>
