<script lang="ts">
  import Tile from './Tile.svelte'
  import Searchbar from './search/Widget.svelte'
  import CalendarWidget from './calendar/Widget.svelte'
  import MessagesWidget from './messages/Widget.svelte'
  import { fly } from 'svelte/transition'
  import type { PageData } from './$types'
  import { t } from '$lib/translations'
  import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'

  export let data: PageData
  let container: HTMLElement
</script>

<svelte:head>
  <title>{$t('common.dashboard')}</title>
</svelte:head>

<main
  bind:this={container}
  class="flex w-full grow flex-col items-center p-3 {data.userConfig.tiles.position === 'split' ? 'relative overflow-y-scroll pt-[15vh]' : ''}"
  class:max-w-screen-lg={data.userConfig.tiles.layout === 'center'}
>
  {#if data.userConfig.searchbar.show && data.searchEngines?.length > 0}
    <section class="flex w-full justify-center">
      <Searchbar engines={data.searchEngines} />
    </section>
  {/if}

  {#if data.userConfig.calendar.show && data.calendarEvents !== null}
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

  {#if data.userConfig.tiles.position === 'split'}
    <section class="flex grow items-center justify-center">
      <button type="button" on:click={() => container.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
        <Fa icon={faAngleDown} class="text-gray-100/50 hover:scale-105 hover:text-white" size="3x" />
      </button>
    </section>
  {/if}

  <div
    class="flex flex-col place-content-end {data.userConfig.tiles.position === 'split' ? 'absolute top-[100vh] pb-6' : 'mt-6'}"
    class:grow={data.userConfig.tiles.position === 'bottom'}
  >
    {#if data.userConfig.tiles.position === 'split'}
      <section class="flex grow justify-center">
        <button type="button" on:click={() => container.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Fa icon={faAngleUp} class="text-gray-100/50 hover:scale-105 hover:text-white" size="3x" />
        </button>
      </section>
    {/if}

    {#each data.sections as section}
      <section class="flex flex-col justify-center">
        {#if section.title || section.subtitle}
          <div class="mt-4 flex flex-col items-center justify-center">
            {#if section.title}
              <h2 class="text-3xl text-slate-200">{section.title}</h2>
            {/if}
            {#if section.subtitle}
              <h3 class="text-xl text-slate-200">{section.subtitle}</h3>
            {/if}
          </div>
        {/if}
        <div class="flex flex-wrap justify-center" in:fly={{ y: 20 }}>
          {#each section.tiles || [] as tile}
            <Tile {...tile}></Tile>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</main>

<style>
  h2,
  h3 {
    text-shadow:
      -1px -1px 0px #6666,
      0px -1px 0px #6666,
      1px -1px 0px #6666,
      -1px 0px 0px #6666,
      1px 0px 0px #6666,
      -1px 1px 0px #6666,
      0px 1px 0px #6666,
      1px 1px 0px #6666;
  }

  main {
    scrollbar-width: thin;
  }
</style>
