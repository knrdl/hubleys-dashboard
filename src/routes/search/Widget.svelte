<script lang="ts">
    import Fa from "svelte-fa";
    import {
        faSearch
    } from '@fortawesome/free-solid-svg-icons'
    import debounce from 'lodash.debounce'
    import {tick} from "svelte";

    export let engines

    let selectedEngine = engines[0]

    let autocompleteResults = []

    let query: string = ''

    const handleInput = debounce(e => {
        if (selectedEngine.autocomplete_url) {
            if (query.length > 2) {
                const searchParams = new URLSearchParams({query, autocomplete_url: selectedEngine.autocomplete_url})
                fetch('search?' + searchParams.toString()).then(async res => {
                    if (res.ok) res.json().then(data => autocompleteResults = data)
                })
            } else {
                autocompleteResults = []
            }
        }
    }, 300)
</script>

<form method="get" target="_blank" rel="noopener noreferrer" action={selectedEngine.search_url}
      on:submit|preventDefault={e=>{e.target.submit();tick.then(()=>query='') }}>
    <div class="flex relative z-[10] group">

        {#if engines?.length > 1}
            <select bind:value={selectedEngine}
                    class="cursor-pointer pl-2 text-sm font-medium text-center text-gray-700 bg-gray-100/70 border border-gray-300 rounded-l-lg group-hover:bg-gray-200 border-r-0 focus:ring-2 focus:outline-none focus:ring-gray-100 dark:bg-gray-700/80 dark:group-hover:bg-gray-700 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600">
                {#each engines as engine}
                    <option value={engine}>{engine.title}</option>
                {/each}
            </select>
        {/if}
        <div class="relative w-full" class:rounded-l-lg={engines?.length === 1}>
            <datalist id="searchboxAutocomplete">
                {#each autocompleteResults as result}
                    <option value={result}>
                {/each}
            </datalist>
            <input type="search" name="q" placeholder={engines?.length > 1 ? "Search" : engines[0].title} required
                   list="searchboxAutocomplete"
                   bind:value={query} on:input={handleInput} class:rounded-l-lg={engines?.length === 1}
                   class:border-l-0={engines?.length > 1}
                   class="block p-2.5 w-full text-sm text-gray-900 bg-gray-100/70 group-hover:bg-gray-200 rounded-none rounded-r-lg  border border-gray-300 dark:bg-gray-700/75 dark:group-hover:bg-gray-700 dark:border-gray-600 placeholder-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-2 focus:outline-none focus:ring-gray-100 dark:focus:ring-gray-700"
            >
            <button type="submit"
                    class="absolute top-0 right-0 h-full w-10 flex justify-center items-center text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100/10 rounded-r-lg border border-gray-300 dark:border-gray-600 group-hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100 dark:bg-gray-700/75 dark:group-hover:bg-gray-700 dark:focus:ring-blue-800">
                <Fa icon={faSearch}/>
            </button>
        </div>
    </div>
</form>

<style>
    input[type="search"] {
        -webkit-appearance: none;
    }
</style>
