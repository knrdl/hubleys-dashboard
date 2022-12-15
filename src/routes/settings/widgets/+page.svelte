<script>
    import Toggle from "./Toggle.svelte";
    import SaveButton from "../SaveButton.svelte";
    import {applyAction, deserialize} from '$app/forms';
    import {invalidateAll} from "$app/navigation";
    import Message from "../Message.svelte";

    export let data
    export let form

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

<form method="POST" on:submit|preventDefault={handleSubmit} action="?/save">
    <div class="flex items-center flex-col">
        <div class="flex flex-col">
            <Toggle bind:checked={data.userConfig.calendar.show}>Show Calendar</Toggle>
            <Toggle bind:checked={data.userConfig.clock.show}>Show Clock</Toggle>
            <Toggle bind:checked={data.userConfig.searchbar.show}>Show Searchbar</Toggle>
            <Toggle bind:checked={data.userConfig.weather.show}>Show Weather</Toggle>
            <hr class="border-gray-200 dark:border-gray-700 my-1">
            <Toggle bind:checked={data.userConfig.settings.big_icon}>Big Settings Icon</Toggle>
        </div>
    </div>
    <div class="flex justify-end">
        <SaveButton/>
    </div>
</form>
