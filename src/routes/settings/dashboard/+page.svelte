<script lang="ts">
  import Toggle from './Toggle.svelte'
  import SaveButton from '../SaveButton.svelte'
  import { applyAction, deserialize } from '$app/forms'
  import { invalidateAll } from '$app/navigation'
  import Message from '../Message.svelte'
  import type { PageData } from './$types.js'
  import { faArrowsToCircle, faLeftRight, faTurnDown, faTurnUp } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'

  export let data: PageData
  export let form

  async function handleSubmit() {
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
  <section class="flex">
    <label class="flex items-center">
      <input type="radio" value="center" bind:group={data.userConfig.tiles.layout} />
      <Fa icon={faArrowsToCircle} size="lg" />
      Center tiles on screen
    </label>

    <label>
      <input type="radio" value="wide" bind:group={data.userConfig.tiles.layout} />
      <Fa icon={faLeftRight} size="lg" />
      Use screen width
    </label>
  </section>

  <header class="text-lg font-bold text-gray-900 dark:text-gray-300">Position</header>
  <section class="flex">
    <label>
      <input type="radio" value="top" bind:group={data.userConfig.tiles.position} />
      <Fa icon={faTurnUp} size="lg" />
      Tiles on top
    </label>

    <label>
      <input type="radio" value="bottom" bind:group={data.userConfig.tiles.position} />
      <Fa icon={faTurnDown} size="lg" />
      Tiles on bottom
    </label>
  </section>

  <header class="text-lg font-bold text-gray-900 dark:text-gray-300">Features</header>
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
    @apply text-gray-900 dark:text-gray-300;
  }

  section {
    @apply ml-6;
  }
</style>
