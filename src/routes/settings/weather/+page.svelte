<script lang="ts">
  import Fa from 'svelte-fa'
  import { faLocationCrosshairs, faMapLocation } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import SaveButton from '../SaveButton.svelte'
  import { applyAction, deserialize } from '$app/forms'
  import { invalidateAll } from '$app/navigation'
  import Message from '../Message.svelte'
  import type { PageData, ActionData } from './$types'
  import { t } from '$lib/translations'

  export let data: PageData
  export let form: ActionData

  let errorMsg = ''

  function getLonLat() {
    navigator.geolocation.getCurrentPosition(
      position => {
        data.userConfig.weather.lon = position.coords.longitude
        data.userConfig.weather.lat = position.coords.latitude
      },
      err => (errorMsg = err.message)
    )
  }

  async function handleSubmit(this: HTMLFormElement) {
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

    const response = await fetch(this.action, { method: 'POST', body })
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
  <Message text={form?.message} kind="success" />

  <div
    class="my-3 flex divide-x divide-gray-200 rounded-lg text-center text-sm font-medium text-gray-500 shadow-sm dark:divide-gray-700 dark:bg-slate-700/80 dark:text-gray-400"
  >
    <button
      class="w-full rounded-l-lg px-1 py-2"
      class:text-white={data.userConfig.weather.mode === 'zip'}
      class:bg-gray-500={data.userConfig.weather.mode === 'zip'}
      on:click={() => {
        data.userConfig.weather.mode = 'zip'
        errorMsg = ''
      }}
    >
      {$t('settings.weather.from-zip-code')}
    </button>
    <button
      class="w-full rounded-r-lg px-1 py-2"
      class:text-white={data.userConfig.weather.mode === 'lonlat'}
      class:bg-gray-500={data.userConfig.weather.mode === 'lonlat'}
      on:click={() => {
        data.userConfig.weather.mode = 'lonlat'
        errorMsg = ''
      }}
    >
      {$t('settings.weather.from-geolocation')}
    </button>
  </div>

  <Message text={errorMsg} kind="error" />

  {#if data.userConfig.weather.mode === 'zip'}
    <div class="my-5 flex">
      <div class="relative z-0 mx-4 grow">
        <input
          type="text"
          id="floating_zip_code"
          class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
          bind:value={data.userConfig.weather.zip_code}
        />
        <label
          for="floating_zip_code"
          class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 dark:peer-focus:text-blue-500"
        >
          {$t('settings.weather.zip-code')}
        </label>
      </div>
      <div class="relative z-0 mx-4 grow">
        <input
          type="text"
          id="floating_country_code"
          class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
          bind:value={data.userConfig.weather.country_code}
        />
        <label
          for="floating_country_code"
          class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 dark:peer-focus:text-blue-500"
        >
          {$t('settings.weather.country-code')}
        </label>
      </div>
    </div>
  {:else}
    <div class="my-5 flex flex-col items-center text-gray-800 dark:text-gray-100">
      {#if hasGeolocation}
        <button
          on:click={getLonLat}
          class="mr-2 mb-2 flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <Fa icon={faLocationCrosshairs} />
          {$t('settings.weather.detect-geolocation')}
        </button>
      {:else}
        <p>{$t('settings.weather.no-geolocation')}</p>
      {/if}
      {#if data.userConfig.weather.lat && data.userConfig.weather.lon}
        <p class="mt-4">{$t('settings.weather.geolocation-lonlat')}: {data.userConfig.weather.lon}, {data.userConfig.weather.lat}</p>
        <a
          href="https://www.openstreetmap.org/?mlat={data.userConfig.weather.lat}&mlon={data.userConfig.weather.lon}&zoom=13"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <Fa icon={faMapLocation} />
          {$t('settings.weather.geolocation-map')}
        </a>
      {:else}
        <p>{$t('settings.weather.geolocation-not-configured')}</p>
      {/if}
    </div>
  {/if}
{:else}
  <Message text="Weather service is not configured" kind="error" />
{/if}

<div class="mt-12 flex items-center justify-center">
  <div class="flex gap-4 text-gray-800 dark:text-gray-100">
    <label class="flex flex-col items-center">
      <input type="radio" class="mr-1" value="metric" bind:group={data.userConfig.weather.units} />
      <div>{$t('weather.metric')}</div>
      <div class="opacity-70">°C</div>
    </label>
    <label class="flex flex-col items-center">
      <input type="radio" class="mr-1" value="imperial" bind:group={data.userConfig.weather.units} />
      <div>{$t('weather.imperial')}</div>
      <div class="opacity-70">°F</div>
    </label>
  </div>
</div>

<form method="POST" on:submit|preventDefault={handleSubmit} action="?/save" class="flex justify-end">
  <SaveButton />
</form>
