<script lang="ts">
    import Fa from "svelte-fa";
    import {faLocationCrosshairs, faMapLocation} from "@fortawesome/free-solid-svg-icons";
    import {onMount} from "svelte";
    import SaveButton from "../SaveButton.svelte";
    import {applyAction, deserialize} from "$app/forms";
    import {invalidateAll} from "$app/navigation";
    import Message from "../Message.svelte";

    export let data
    export let form

    let errorMsg = ''

    function getLonLat() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                data.userConfig.weather.lon = position.coords.longitude
                data.userConfig.weather.lat = position.coords.latitude
            }, err => errorMsg = err.message)
    }

    async function handleSubmit(event) {
        const weatherConfig = data.userConfig.weather
        if (weatherConfig.mode === 'zip' && (!weatherConfig.zip_code || !weatherConfig.country_code)) {
            errorMsg = 'Fields cannot be empty.'
            return
        } else if (weatherConfig.mode === 'lonlat' && (!weatherConfig.lon || !weatherConfig.lat)) {
            errorMsg = 'You must supply a geolocation.'
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


    let hasGeolocation = false
    onMount(() => {
        hasGeolocation = !!window?.navigator?.geolocation
    })
</script>

{#if data.isWeatherProviderConfigured}
    <Message text={form?.message} kind="success"/>

    <div class="my-3 text-sm font-medium text-center text-gray-500 rounded-lg divide-x divide-gray-200 shadow flex dark:divide-gray-700 dark:text-gray-400 dark:bg-slate-700/80">
        <button class="py-2 px-1 w-full rounded-l-lg"
                class:text-white={data.userConfig.weather.mode === 'zip'}
                class:bg-gray-500={data.userConfig.weather.mode === 'zip'}
                on:click={()=>{data.userConfig.weather.mode = 'zip';errorMsg=''}}>
            from zip code
        </button>
        <button class="py-2 px-1 w-full rounded-r-lg"
                class:text-white={data.userConfig.weather.mode === 'lonlat'}
                class:bg-gray-500={data.userConfig.weather.mode === 'lonlat'}
                on:click={()=>{data.userConfig.weather.mode = 'lonlat';errorMsg=''}}>
            from geolocation
        </button>
    </div>

    <Message text={errorMsg} kind="error"/>

    {#if data.userConfig.weather.mode === 'zip'}
        <div class="flex my-5">
            <div class="relative z-0 grow mx-4">
                <input type="text" id="floating_zip_code"
                       class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                       placeholder=" " bind:value={data.userConfig.weather.zip_code}/>
                <label for="floating_zip_code"
                       class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Zip Code
                </label>
            </div>
            <div class="relative z-0 grow mx-4">
                <input type="text" id="floating_country_code"
                       class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                       placeholder=" " bind:value={data.userConfig.weather.country_code}/>
                <label for="floating_country_code"
                       class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Country Code (2 letter)
                </label>
            </div>
        </div>
    {:else}
        <div class="my-5 flex flex-col items-center text-gray-800 dark:text-gray-100">
            {#if hasGeolocation}
                <button on:click={getLonLat}
                        class="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                    <Fa icon={faLocationCrosshairs}/>
                    Detect your current position
                </button>
            {:else}
                <p>Your browser doesn't support geolocation.</p>
            {/if}
            {#if data.userConfig.weather.lat && data.userConfig.weather.lon}
                <p class="mt-4">Configured Location: {data.userConfig.weather.lon}, {data.userConfig.weather.lat}</p>
                <a href="https://www.openstreetmap.org/?mlat={data.userConfig.weather.lat}&mlon={data.userConfig.weather.lon}&zoom=13"
                   target="_blank" rel="noopener noreferrer"
                   class="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700">
                    <Fa icon={faMapLocation}/>
                    Show on map
                </a>
            {:else}
                <p>No position configured yet.</p>
            {/if}
        </div>
    {/if}
{:else}
    <Message text="Weather service is not configured" kind="error"/>
{/if}

<form method="POST" on:submit|preventDefault={handleSubmit} action="?/save" class="flex justify-end">
    <SaveButton/>
</form>

