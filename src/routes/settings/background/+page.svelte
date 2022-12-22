<script lang="ts">
    import {applyAction, deserialize, enhance} from '$app/forms';
    import Fa from "svelte-fa";
    import {faDownload, faInfoCircle, faRotate} from "@fortawesome/free-solid-svg-icons";
    import BackgroundRule from "./BackgroundRule.svelte";
    import SaveButton from "../SaveButton.svelte";
    import {invalidateAll} from "$app/navigation";
    import Message from "../Message.svelte";

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
</script>

<Message text={form?.message} kind="success"/>

{#if data.background?.image?.url}
    <h1>Current random image:</h1>
    <form method="POST" use:enhance>
        <div class="flex gap-2">
            <button type="submit" formaction="?/reload-random-background-image">
                <Fa icon={faRotate}/>
                New Random Background Image
            </button>
        </div>
    </form>
    <a href={data.background.image.url} target="_blank" rel="noopener noreferrer">
        <Fa icon={faDownload}/>
        Download Background Image
    </a>
{/if}

<h1>Rules:</h1>
{#each data.userConfig.background_rules as rule}
    <BackgroundRule {rule} {data}/>
{/each}

<form method="POST" on:submit|preventDefault={handleSubmit} action="?/save" class="flex justify-end">
    <SaveButton/>
</form>

<!--<style>-->
<!--    /*button, a {*/-->
<!--    /*    @apply grow text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700;*/-->
<!--    /*}*/-->
<!--</style>-->
