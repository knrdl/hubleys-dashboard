<script lang="ts">
  import Toggle from './Toggle.svelte'
  import SaveButton from '../SaveButton.svelte'
  import { applyAction, deserialize } from '$app/forms'
  import { invalidateAll } from '$app/navigation'
  import Message from '../Message.svelte'
  import type { PageData } from './$types.js'
  import TilesVisualizer from './TilesVisualizer.svelte'

  export let data: PageData
  export let form

  async function handleSubmit(this: HTMLFormElement) {
    const body = new FormData()
    body.set('userConfig', JSON.stringify(data.userConfig))

    const response = await fetch(this.action, { method: 'POST', body })
    const result = deserialize(await response.text())
    if (result.type === 'success') {
      await invalidateAll()
    }
    applyAction(result)
  }
</script>

<Message text={form?.message} kind="success" />

<form method="POST" on:submit|preventDefault={handleSubmit} action="?/save">
  <header class="text-lg font-bold text-gray-900 dark:text-gray-300">Layout</header>
  <section class="mb-8">
    <label class="mb-5 flex flex-wrap items-center gap-2">
      <div class="min-w-48">
        <input type="radio" value="center" bind:group={data.userConfig.tiles.layout} class="mr-3 h-4" />
        Center tiles on screen
      </div>
      <TilesVisualizer mode="center" active={data.userConfig.tiles.layout === 'center'} />
    </label>
    <label class="flex flex-wrap items-center gap-2">
      <div class="min-w-48">
        <input type="radio" value="wide" bind:group={data.userConfig.tiles.layout} class="mr-3 h-4" />
        Fill screen with tiles
      </div>
      <TilesVisualizer mode="wide" active={data.userConfig.tiles.layout === 'wide'} />
    </label>
  </section>

  <header class="text-lg font-bold text-gray-900 dark:text-gray-300">Position</header>
  <section class="mb-8 flex gap-2 max-sm:mt-2 sm:gap-20 sm:pl-20">
    <label class="flex flex-col items-center">
      <input type="radio" value="top" bind:group={data.userConfig.tiles.position} />
      <div class="mt-1">Tiles on top</div>
      <TilesVisualizer mode="top" active={data.userConfig.tiles.position === 'top'} />
    </label>

    <label class="flex flex-col items-center">
      <input type="radio" value="bottom" bind:group={data.userConfig.tiles.position} />
      <div class="mt-1">Tiles on bottom</div>
      <TilesVisualizer mode="bottom" active={data.userConfig.tiles.position === 'bottom'} />
    </label>
  </section>

  <header class="mb-2 text-lg font-bold text-gray-900 dark:text-gray-300">Features</header>
  <section class="flex flex-col items-start">
    <div class="flex flex-col">
      <Toggle bind:checked={data.userConfig.calendar.show}>Show Calendar</Toggle>
      <Toggle bind:checked={data.userConfig.clock.show}>Show Clock</Toggle>
      <Toggle bind:checked={data.userConfig.searchbar.show}>Show Searchbar</Toggle>
      <Toggle bind:checked={data.userConfig.weather.show}>Show Weather</Toggle>
      <hr class="my-1 border-gray-200 dark:border-gray-700" />
      <Toggle bind:checked={data.userConfig.dashboard.show_settings_text}>Show Settings text on dashboard</Toggle>
    </div>
  </section>
  <div class="flex justify-end">
    <SaveButton />
  </div>
</form>

<style lang="postcss">
  label {
    @apply cursor-pointer text-gray-900 dark:text-gray-300;
  }

  section {
    @apply ml-6;
  }

  input[type='radio'] {
    @apply scale-150 accent-blue-600;
  }
</style>
