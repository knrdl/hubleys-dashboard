<script lang="ts">
  import Toggle from './Toggle.svelte'
  import SaveButton from '../SaveButton.svelte'
  import { applyAction, deserialize } from '$app/forms'
  import { invalidateAll } from '$app/navigation'
  import Message from '../Message.svelte'
  import type { PageData } from './$types.js'

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
  <div class="flex flex-col items-center">
    <div class="flex flex-col">
      <Toggle bind:checked={data.userConfig.calendar.show}>Show Calendar</Toggle>
      <Toggle bind:checked={data.userConfig.clock.show}>Show Clock</Toggle>
      <Toggle bind:checked={data.userConfig.searchbar.show}>Show Searchbar</Toggle>
      <Toggle bind:checked={data.userConfig.weather.show}>Show Weather</Toggle>
      <hr class="my-1 border-gray-200 dark:border-gray-700" />
      <Toggle bind:checked={data.userConfig.dashboard.show_settings_text}>Show Settings text on dashboard</Toggle>
    </div>
  </div>
  <div class="flex justify-end">
    <SaveButton />
  </div>
</form>
