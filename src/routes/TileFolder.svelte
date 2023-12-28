<script lang="ts">
  import { scale } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import TileComponent from './Tile.svelte'
  import type { Tile } from '$lib/server/sysconfig/types'

  const dispatch = createEventDispatcher()
  export let clickX: number = 0
  export let clickY: number = 0

  export let menu: Tile['menu']

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

{#if menu}
  <button
    type="button"
    class="fixed bottom-0 left-0 right-0 top-0 z-[1000] block h-screen w-screen cursor-default"
    on:click|stopPropagation={() => dispatch('close')}
    on:keydown={keydown}
  >
    <div
      class="fixed rounded-lg border border-gray-200 bg-gray-100/75 p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900/95"
      bind:clientWidth={dialogWidth}
      bind:clientHeight={dialogHeight}
      style="left: {leftPos}px; top: {topPos}px"
      transition:scale={{ duration: 200 }}
    >
      <div class="mb-2">
        <h1 class="select-none text-center text-2xl text-gray-900 dark:text-gray-100">
          {menu.title}
        </h1>
        {#if menu.subtitle}
          <h2 class="select-none text-center text-lg text-gray-900 dark:text-gray-100">
            {menu.subtitle}
          </h2>
        {/if}
      </div>
      <div class="inline-grid gap-1" class:grid-cols-2={menu.tiles.length > 1} class:grid-rows-2={menu.tiles.length > 2}>
        {#each menu.tiles || [] as menuTile, idx}
          <div class:col-span-2={idx === menu.tiles.length - 1 && idx % 2 === 0} class="flex justify-center">
            <TileComponent {...menuTile} />
          </div>
        {/each}
      </div>
    </div>
  </button>
{/if}
