<script lang="ts">
  import Fa from 'svelte-fa'
  import { faSearch } from '@fortawesome/free-solid-svg-icons'
  import debounce from 'lodash.debounce'
  import { onMount, tick } from 'svelte'
  import { t } from '$lib/translations'
  import type { SearchEngine } from '$lib/server/sysconfig/types'

  export let engines: SearchEngine[]

  let selectedEngine = engines[0]
  let inputElement: HTMLInputElement

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

  onMount(() => {
    const searchUrl = localStorage.getItem('hubleys:search:selected-engine')
    if (searchUrl) selectedEngine = engines.find(eng => eng.search_url === searchUrl) || selectedEngine
  })

  function submit(e: SubmitEvent) {
    ;(e.target as HTMLFormElement).submit()
    tick().then(() => (query = ''))
  }

  let wheelBlocked: boolean = false
  function wheel(e: WheelEvent) {
    e.preventDefault()
    if (!wheelBlocked) {
      wheelBlocked = true
      const idx = engines.indexOf(selectedEngine)
      if (e.deltaY > 0 && idx < engines.length - 1) selectedEngine = engines[idx + 1]
      if (e.deltaY < 0 && idx > 0) selectedEngine = engines[idx - 1]
      setTimeout(() => (wheelBlocked = false), 333)
    }
  }

  function onSelectedEngineChange() {
    inputElement.focus()
    localStorage.setItem('hubleys:search:selected-engine', selectedEngine.search_url)
  }
</script>

<form
  method="get"
  target={(selectedEngine.target || 'new-tab').replace('new-tab', '_blank').replace('same-tab', '_self')}
  rel="noopener noreferrer"
  action={selectedEngine.search_url}
  on:submit|preventDefault={submit}
  class="max-w-lg grow"
>
  <div class="group relative z-10 flex" on:wheel={wheel}>
    {#if engines?.length > 1}
      <select
        bind:value={selectedEngine}
        on:change={onSelectedEngineChange}
        class="cursor-pointer rounded-l-full border border-r-0 border-gray-300 bg-gray-100/70 pl-2 text-center text-sm font-medium text-gray-700 group-hover:bg-gray-200 focus:ring-2 focus:ring-gray-100 focus:outline-hidden dark:border-gray-600 dark:bg-gray-700/80 dark:text-white dark:group-hover:bg-gray-700 dark:focus:ring-gray-700"
      >
        {#each engines as engine}
          <option value={engine}>{engine.title}</option>
        {/each}
      </select>
    {/if}
    <div class="relative w-full" class:rounded-l-full={engines?.length === 1}>
      <datalist id="searchboxAutocomplete">
        {#each autocompleteResults as result}
          <option value={result} />
        {/each}
      </datalist>
      {#each new URL(selectedEngine.search_url).searchParams as [k, v]}
        <input type="hidden" name={k} value={v} />
      {/each}
      <input
        type="search"
        name={selectedEngine.search_parameter || 'q'}
        placeholder={engines?.length > 1 ? $t('dashboard.search.placeholder') : engines[0].title}
        required
        list="searchboxAutocomplete"
        bind:value={query}
        bind:this={inputElement}
        on:input={handleInput}
        class:rounded-l-full={engines?.length === 1}
        class:border-l-0={engines?.length > 1}
        class="block w-full rounded-none rounded-r-full border border-gray-300 bg-gray-100/70 p-2.5 text-gray-900 placeholder-gray-600 group-hover:bg-gray-200 focus:ring-2 focus:ring-gray-100 focus:outline-hidden dark:border-gray-600 dark:bg-gray-700/75 dark:text-white dark:placeholder-gray-400 dark:group-hover:bg-gray-700 dark:focus:ring-gray-700"
      />
      <button
        type="submit"
        class="absolute top-0 right-0 flex h-full w-10 items-center justify-center rounded-r-full border border-gray-300 bg-gray-100/10 text-sm font-medium text-gray-900 group-hover:bg-gray-200 focus:ring-2 focus:ring-gray-100 focus:outline-hidden dark:border-gray-600 dark:bg-gray-700/75 dark:text-gray-100 dark:group-hover:bg-gray-700 dark:focus:ring-blue-800"
      >
        <Fa icon={faSearch} />
        <span class="sr-only">search</span>
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
