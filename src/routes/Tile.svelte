<script lang="ts">
  import Fa from 'svelte-fa'
  import { faEllipsisV, faCircleQuestion, faExpand, faFolderOpen, faPlus } from '@fortawesome/free-solid-svg-icons'
  import TileFolder from './TileFolder.svelte'

  export let title: Tile['title']
  export let emoji: Tile['emoji'] = undefined
  export let logo: Tile['logo'] = undefined
  export let url: Tile['url'] = undefined
  export let display: Tile['display'] = undefined
  export let menu: Tile['menu'] = undefined

  let selectedCoords: null | { x: number; y: number } = null

  function onMoreClick(ev: MouseEvent) {
    selectedCoords = { x: ev.x, y: ev.y }
  }

  function onTileClick(ev: MouseEvent) {
    if (!url) {
      ev.preventDefault()
      ev.stopPropagation()
      selectedCoords = { x: ev.x, y: ev.y }
    }
  }
</script>

{#if selectedCoords}
  <TileFolder clickX={selectedCoords.x} clickY={selectedCoords.y} on:close={() => (selectedCoords = null)} {menu} folderTitle={title} />
{/if}

<a
  href={url || '#'}
  target="_blank"
  rel="noopener noreferrer"
  class="card
group relative
m-2 flex flex-col
justify-center rounded-md bg-gradient-to-br from-gray-700/90 via-slate-600/90
to-zinc-700/90 p-1 no-underline shadow-md
transition-transform ease-in-out hover:scale-110 hover:bg-gradient-to-tr
hover:from-teal-600/90 hover:via-sky-700/90 hover:to-indigo-700/90
"
  on:click={onTileClick}
>
  {#if menu}
    {#if url}
      <button
        on:click|preventDefault|stopPropagation={onMoreClick}
        class="
                    absolute -right-1 -top-1 inline-flex h-8
                    w-8 items-center justify-center
                    rounded-lg text-xs font-bold
                    text-slate-100
                    transition-transform ease-in-out hover:bg-slate-900/80 group-hover:scale-110
                    group-hover:text-white
                        "
      >
        <Fa icon={faEllipsisV} />
      </button>
    {:else}
      <div
        class="
                absolute -right-1 -top-1 inline-flex h-8
                w-8 items-center justify-center
                text-xs font-bold text-slate-400 group-hover:text-slate-200
            "
      >
        <Fa icon={faPlus} />
      </div>
    {/if}
  {/if}
  <div {title} class="flex h-12 items-center justify-center overflow-hidden text-4xl text-stone-200">
    {#if logo}
      <img src={logo} alt={emoji || title} class="max-h-full max-w-full" />
    {:else if emoji}
      <span>{emoji}</span>
    {:else if url}
      <Fa icon={faCircleQuestion} />
    {:else if menu?.some((itm, idx) => idx < 4 && (itm.logo || itm.emoji))}
      <div class="inline-grid gap-1 text-xl" class:grid-cols-2={menu.length > 1} class:grid-rows-2={menu.length > 2}>
        {#each menu as item, index}
          {#if index < 4}
            <div class:col-span-2={index === menu.length - 1 && index % 2 === 0} class="flex justify-center">
              <div class="flex h-6 w-6 items-center justify-center">
                {#if item.logo}
                  <img src={item.logo} alt={item.emoji || item.title} class="max-h-full max-w-full" />
                {:else if item.emoji}
                  <span>{item.emoji}</span>
                {:else}
                  <Fa icon={faExpand} />
                {/if}
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {:else}
      <Fa icon={faFolderOpen} />
    {/if}
  </div>
  {#if display !== 'icon-only' || (!logo && !emoji)}
    <span class="mt-1 overflow-hidden text-center leading-5 text-slate-300">{title}</span>
  {/if}
</a>

<style>
  .card {
    --height: 90px;
    --width: calc(var(--height) * 1.618);
    width: var(--width);
    height: var(--height);
  }
</style>
