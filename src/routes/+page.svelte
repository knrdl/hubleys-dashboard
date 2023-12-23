<script lang="ts">
  import Tile from './Tile.svelte'
  import Searchbar from './search/Widget.svelte'
  import CalendarWidget from './calendar/Widget.svelte'
  import MessagesWidget from './messages/Widget.svelte'
  import { fly } from 'svelte/transition'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<main class="flex w-full grow flex-col p-3" class:max-w-screen-lg={data.userConfig.tiles.layout === 'center'}>
  {#if data.userConfig?.searchbar.show && data.searchEngines?.length > 0}
    <section class="flex justify-center">
      <Searchbar engines={data.searchEngines} />
    </section>
  {/if}

  {#if data.userConfig?.calendar.show && data.calendarEvents !== null}
    <section class="mt-3 flex justify-center">
      <a
        href="/calendar"
        class="group z-[10] select-none rounded-md bg-gray-100/80 pb-1 pl-3 pr-2 pt-1 text-gray-900 hover:bg-gray-200 dark:bg-gray-700/90 dark:text-gray-100 dark:hover:bg-gray-700"
      >
        <CalendarWidget calendarEvents={data.calendarEvents} userLang={data.userLang} />
      </a>
    </section>
  {/if}

  {#if data.messages && data.messages.length > 0}
    <section class="mt-3 flex flex-col items-center justify-center gap-2">
      <MessagesWidget messages={data.messages} />
    </section>
  {/if}

  <section class="mt-6 flex items-end justify-center" class:grow={data.userConfig.tiles.position === 'bottom'}>
    <div class="flex flex-wrap justify-center" in:fly={{ y: 20 }}>
      {#each data.tiles as tile}
        <Tile {...tile}></Tile>
      {/each}
    </div>
  </section>
</main>
