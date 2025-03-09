<script lang="ts">
  import Fa from 'svelte-fa'
  import { faEllipsisV, faCircleQuestion, faExpand, faFolderOpen, faPlus } from '@fortawesome/free-solid-svg-icons'
  import TileFolder from './TileFolder.svelte'
  import type { Tile } from '$lib/server/sysconfig/types'
  import { t } from '$lib/translations'

  export let title: Tile['title']
  export let subtitle: Tile['subtitle'] = undefined
  export let emoji: Tile['emoji'] = undefined
  export let logo: Tile['logo'] = undefined
  export let url: Tile['url'] = undefined
  export let only_icon: Tile['only_icon'] = undefined
  export let menu: Tile['menu'] = undefined

  let selectedCoords: null | { x: number; y: number } = null

  function logo2url(logo: string) {
    if (logo.match(/^https?:\/\/.+/)) return logo
    else return '/logo/' + encodeURIComponent(logo)
  }

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
  <TileFolder clickX={selectedCoords.x} clickY={selectedCoords.y} on:close={() => (selectedCoords = null)} {menu} />
{/if}

<a
  href={(typeof url === 'object' ? url.value : url) || '#'}
  target={((typeof url === 'object' ? url.target : undefined) || 'new-tab').replace('new-tab', '_blank').replace('same-tab', '_self')}
  rel="noopener noreferrer"
  class="card
group relative
m-2 flex flex-col
justify-center rounded-md bg-linear-to-br from-gray-700/90 via-slate-600/90
to-zinc-700/90 p-1 no-underline shadow-md
transition-transform ease-in-out hover:scale-110 hover:bg-linear-to-tr
hover:from-teal-600/90 hover:via-sky-700/90 hover:to-indigo-700/90
"
  on:click={onTileClick}
>
  {#if menu}
    {#if url}
      <button
        title={$t('dashboard.menu')}
        on:click|preventDefault|stopPropagation={onMoreClick}
        class="
                    absolute -top-1 -right-1 inline-flex h-8
                    w-8 items-center justify-center
                    rounded-lg text-xs font-bold
                    text-slate-100
                    transition-transform ease-in-out group-hover:scale-110 group-hover:text-white
                    hover:bg-slate-900/80
                        "
      >
        <Fa icon={faEllipsisV} />
      </button>
    {:else}
      <div
        title={$t('dashboard.show-more')}
        class="
                absolute -top-1 -right-1 inline-flex h-8
                w-8 items-center justify-center
                text-xs font-bold text-slate-400 group-hover:text-slate-200
            "
      >
        <Fa icon={faPlus} />
      </div>
    {/if}
  {/if}
  <div class="flex h-12 items-center justify-center overflow-hidden text-4xl text-stone-200">
    {#if logo}
      <img src={logo2url(logo)} alt={$t('dashboard.logo')} class="max-h-full max-w-full" />
    {:else if emoji}
      <span>{emoji}</span>
    {:else if url}
      <Fa icon={faCircleQuestion} />
    {:else if menu?.tiles.some((itm, idx) => idx < 4 && (itm.logo || itm.emoji))}
      <div class="inline-grid gap-1 text-xl" class:grid-cols-2={menu.tiles.length > 1} class:grid-rows-2={menu.tiles.length > 2}>
        {#each menu.tiles as menuTile, index}
          {#if index < 4}
            <div class:col-span-2={index === menu.tiles.length - 1 && index % 2 === 0} class="flex justify-center">
              <div class="flex h-6 w-6 items-center justify-center">
                {#if menuTile.logo}
                  <img src={logo2url(menuTile.logo)} alt={$t('dashboard.logo')} class="max-h-full max-w-full" />
                {:else if menuTile.emoji}
                  <span>{menuTile.emoji}</span>
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
  {#if !only_icon || (!logo && !emoji)}
    <h3 class="mt-1 overflow-hidden text-center leading-5 text-slate-300">{title || '???'}</h3>
    {#if subtitle}
      <h4 class="overflow-hidden text-center text-xs text-slate-300">{subtitle}</h4>
    {/if}
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
