<script lang="ts">
  import Fa from 'svelte-fa'
  import { faSearch } from '@fortawesome/free-solid-svg-icons'
  import debounce from 'lodash.debounce'
  import { tick } from 'svelte'
  import { t } from '$lib/translations'
  import type { SearchEngine } from '$lib/server/sysconfig/types'

  export let engines: SearchEngine[]

  let selectedEngine = engines[0]

  let autocompleteResults: string[] = []

  let query: string = ''

  const handleInput = debounce(() => {
    if (selectedEngine.autocomplete_url) {
      if (query.length > 2) {
        const searchParams = new URLSearchParams({
          query,
          autocomplete_url: selectedEngine.autocomplete_url
        })
        fetch('search?' + searchParams.toString()).then(async res => {
          if (res.ok) res.json().then(data => (autocompleteResults = data))
        })
      } else {
        autocompleteResults = []
      }
    }
  }, 300)

  function submit(e: SubmitEvent) {
    ;(e.target as HTMLFormElement).submit()
    tick().then(() => (query = ''))
  }
</script>

<form method="get" target="_blank" rel="noopener noreferrer" action={selectedEngine.search_url} on:submit|preventDefault={submit} class="max-w-md grow">
  <div class="group relative z-[10] flex">
    {#if engines?.length > 1}
      <select
        bind:value={selectedEngine}
        class="cursor-pointer rounded-l-lg border border-r-0 border-gray-300 bg-gray-100/70 pl-2 text-center text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100 group-hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700/80 dark:text-white dark:focus:ring-gray-700 dark:group-hover:bg-gray-700"
      >
        {#each engines as engine}
          <option value={engine}>{engine.title}</option>
        {/each}
      </select>
    {/if}
    <div class="relative w-full" class:rounded-l-lg={engines?.length === 1}>
      <datalist id="searchboxAutocomplete">
        {#each autocompleteResults as result}
          <option value={result} />{/each}
      </datalist>
      <input
        type="search"
        name="q"
        placeholder={engines?.length > 1 ? $t('dashboard.search.placeholder') : engines[0].title}
        required
        list="searchboxAutocomplete"
        bind:value={query}
        on:input={handleInput}
        class:rounded-l-lg={engines?.length === 1}
        class:border-l-0={engines?.length > 1}
        class="block w-full rounded-none rounded-r-lg border border-gray-300 bg-gray-100/70 p-2.5 text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-100 group-hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700/75 dark:text-white dark:placeholder-gray-400 dark:focus:ring-gray-700 dark:group-hover:bg-gray-700"
      />
      <button
        type="submit"
        class="absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r-lg border border-gray-300 bg-gray-100/10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100 group-hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700/75 dark:text-gray-100 dark:focus:ring-blue-800 dark:group-hover:bg-gray-700"
      >
        <Fa icon={faSearch} />
      </button>
    </div>
  </div>
</form>

<style>
  input[type='search'] {
    /* safari problems */
    appearance: none;
  }
</style>
