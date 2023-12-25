<script lang="ts">
  import SaveButton from '../SaveButton.svelte'
  import { applyAction, deserialize } from '$app/forms'
  import { invalidateAll } from '$app/navigation'
  import Message from '../Message.svelte'

  export let data
  export let form

  let errorMsg = ''

  async function handleSubmit(this: HTMLFormElement) {
    if (data.userConfig.language !== null && data.userConfig.language?.length !== 2) {
      errorMsg = 'Language code must be 2 characters.'
      return
    }
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
<Message text={errorMsg} kind="error" />

<label class="mb-2 block">
  <span class="mb-4 font-bold text-gray-900 dark:text-white">Theme</span>
  <select
    bind:value={data.userConfig.theme}
    class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
  >
    <option value="system">Auto</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</label>

<h3 class="mb-1 font-bold text-gray-900 dark:text-white">Language</h3>
<ul
  class="w-full items-start rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 sm:flex dark:border-gray-600 dark:bg-gray-700 dark:text-white"
>
  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
    <div class="flex items-center pl-3">
      <label class="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        <input
          type="radio"
          value=""
          name="language-mode"
          checked={data.userConfig.language === null}
          on:change={() => (data.userConfig.language = null)}
          class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
        />
        Auto
      </label>
    </div>
  </li>
  <li class="w-full dark:border-gray-600">
    <div class="flex items-center pl-3">
      <label class="mx-2 w-auto w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        <input
          type="radio"
          value=""
          name="language-mode"
          checked={data.userConfig.language !== null}
          on:change={() => (data.userConfig.language = '')}
          class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
        />
        Manual
      </label>

      {#if data.userConfig.language !== null}
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          <input
            type="text"
            bind:value={data.userConfig.language}
            class="block w-full rounded-r-lg border-l border-gray-400 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="enter 2 letter language code"
            required
          />
        </label>
      {/if}
    </div>
  </li>
</ul>
<p class="ml-1 mt-1 text-gray-900 dark:text-white">
  Current language:
  <span class="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">{data.userLang}</span>
</p>

<form method="POST" on:submit|preventDefault={handleSubmit} action="?/save" class="mt-4 flex justify-end">
  <SaveButton />
</form>
