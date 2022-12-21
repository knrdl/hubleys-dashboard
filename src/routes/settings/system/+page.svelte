<script lang="ts">
    import Fa from "svelte-fa";
    import SaveButton from "../SaveButton.svelte";
    import {applyAction, deserialize} from "$app/forms";
    import {invalidateAll} from "$app/navigation";
    import Message from "../Message.svelte";

    export let data
    export let form

    let errorMsg = ''

    async function handleSubmit(event) {
        if (data.userConfig.language !== null && data.userConfig.language?.length !== 2) {
            errorMsg = 'Language code must be 2 characters.'
            return
        }
        const body = new FormData()
        body.set('userConfig', JSON.stringify(data.userConfig))

        const response = await fetch(this.action, {method: 'POST', body})
        const result = deserialize(await response.text())
        if (result.type === 'success') {
            await invalidateAll()
        }
        applyAction(result)
    }

</script>

<Message text={form?.message} kind="success"/>
<Message text={errorMsg} kind="error"/>

<label class="block mb-2">
    <span class="mb-4 font-bold text-gray-900 dark:text-white">Theme</span>
    <select bind:value={data.userConfig.theme}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
        <option value="system">Auto</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</label>


<h3 class="font-semibold text-gray-900 dark:text-white mb-1">Language</h3>
<ul class="items-start w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
        <div class="flex items-center pl-3">
            <label class="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">
                <input type="radio" value="" name="language-mode" checked={data.userConfig.language === null}
                       on:change={() => data.userConfig.language = null}
                       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                Auto
            </label>
        </div>
    </li>
    <li class="w-full dark:border-gray-600">
        <div class="flex items-center pl-3">
            <label class="py-3 mx-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300 w-auto">
                <input type="radio" value="" name="language-mode" checked={data.userConfig.language !== null}
                       on:change={() => data.userConfig.language = ''}
                       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                Manual
            </label>

            {#if data.userConfig.language !== null}
                <label class="block text-sm font-medium text-gray-900 dark:text-white">
                    <input type="text" bind:value={data.userConfig.language}
                           class="bg-gray-50 text-gray-900 text-sm block w-full p-2.5 rounded-r-lg border-l border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                           placeholder="enter 2 letter language code" required>
                </label>
            {/if}
        </div>
    </li>
</ul>
<p class="text-gray-900 dark:text-white mt-1 ml-1">
    Current language:
    <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{data.userLang}</span>
</p>

<form method="POST" on:submit|preventDefault={handleSubmit} action="?/save" class="flex justify-end mt-4">
    <SaveButton/>
</form>

