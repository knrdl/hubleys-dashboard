<script lang="ts">
    import {applyAction, deserialize, enhance} from '$app/forms';
    import Fa from "svelte-fa";
    import {faDownload, faInfoCircle, faRotate} from "@fortawesome/free-solid-svg-icons";
    import BackgroundRule from "./BackgroundEditor.svelte";
    import SaveButton from "../SaveButton.svelte";
    import {invalidateAll} from "$app/navigation";
    import Message from "../Message.svelte";
    import cloneDeep from 'lodash.clonedeep'

    export let form;
    export let data;

    async function handleSubmit(event) {
        const body = new FormData()
        body.set('userConfig', JSON.stringify(data.userConfig))

        const response = await fetch(this.action, {method: 'POST', body})
        const result = deserialize(await response.text())
        if (result.type === 'success') {
            await invalidateAll()
        }
        applyAction(result)
    }

    function cloneCfg(idx, config) {
        data.userConfig.backgrounds.splice(idx + 1, 0, {...cloneDeep(config), selected: false})
        data.userConfig.backgrounds = data.userConfig.backgrounds
    }

    function selectCfg(config) {
        data.userConfig.backgrounds.forEach(bg => bg.selected = false)
        config.selected = true
        data.userConfig.backgrounds = data.userConfig.backgrounds
    }

    function deleteCfg(idx) {
        const wasSelected = data.userConfig.backgrounds[idx].selected
        data.userConfig.backgrounds.splice(idx, 1)
        data.userConfig.backgrounds = data.userConfig.backgrounds
        if (wasSelected)
            data.userConfig.backgrounds[Math.max(idx - 1, 0)].selected = true
    }
</script>

<Message text={form?.message} kind="success"/>

<div>
    {#if data.background?.image?.url}
        <p class="heading">Current random image</p>
        <div class="flex items-center mb-5">
            <form method="POST" use:enhance>
                <div class="flex gap-2">
                    <button type="submit" formaction="?/reload-random-background-image" class="icon-button">
                        <Fa icon={faRotate}/>
                        Shuffle
                    </button>
                </div>
            </form>
            <a href={data.background.image.url} target="_blank" rel="noopener noreferrer" class="icon-button">
                <Fa icon={faDownload}/>
                Download
            </a>
        </div>
    {/if}

    <p class="heading">Your Backgrounds</p>
    {#each data.userConfig.backgrounds as config, idx}
        <BackgroundRule {config} {data}
                        on:clone={()=>cloneCfg(idx, config)}
                        on:select={()=>selectCfg(config)}
                        on:delete={()=>deleteCfg(idx)}
        />
    {/each}
</div>

<form method="POST" on:submit|preventDefault={handleSubmit} action="?/save" class="flex justify-end">
    <SaveButton/>
</form>

<style>
    div .heading {
        @apply text-lg font-semibold text-gray-900 dark:text-gray-300;
    }

    div .icon-button {
        @apply flex justify-center gap-1 p-3;
        @apply text-white bg-blue-700/80 hover:bg-blue-800 font-medium rounded-lg text-sm p-1 text-center inline-flex items-center mr-2 dark:bg-blue-600/80 dark:hover:bg-blue-700;
    }
</style>
