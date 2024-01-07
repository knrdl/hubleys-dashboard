<script lang="ts">
  import Fa from 'svelte-fa'
  import { faBinoculars, faCheckCircle, faSun, faUpLong, faDownLong } from '@fortawesome/free-solid-svg-icons'
  import { fly } from 'svelte/transition'
  import type { PageData } from './$types'
  import { t } from '$lib/translations'

  export let data: PageData

  function isNewDay(oldTimestamp: number, newTimestamp: number) {
    if (!oldTimestamp || !newTimestamp) return false
    const oldTs = new Date(oldTimestamp * 1000)
    const newTs = new Date(newTimestamp * 1000)
    return oldTs.getDay() !== newTs.getDay()
  }

  function fmtTime(epoch: number) {
    return new Date(epoch * 1000).toLocaleTimeString(data.userLang, { hour: '2-digit', minute: '2-digit' })
  }
</script>

<svelte:head>
  <title>{$t('common.weather')}</title>
</svelte:head>

<div class="my-3 rounded-lg bg-slate-300/90 p-1 drop-shadow dark:bg-slate-900/90" in:fly={{ y: -20 }}>
  <table class="w-full border-b-8 border-gray-100 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
    <thead class="sticky top-0 bg-gray-400 text-xs uppercase text-gray-700 dark:bg-black/90 dark:text-gray-400">
      <tr>
        <th colspan="3" scope="col" class="px-4 py-3">
          <div class="flex justify-between">
            <div class="ml-3 flex flex-col items-start">
              <div class="flex items-center gap-1">
                <Fa icon={faSun} />
                <Fa icon={faUpLong} />
                <span>{fmtTime(data.currentWeather.sunrise_epoch)}</span>
              </div>
              <div class="flex items-center gap-1">
                <Fa icon={faSun} />
                <Fa icon={faDownLong} />
                <span>{fmtTime(data.currentWeather.sunset_epoch)}</span>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <div>{$t('weather.temperature')}</div>
              <div class="font-normal">({$t('weather.feelslike')})</div>
            </div>
          </div>
        </th>
        <th scope="col" class="px-4 py-3 text-right">
          <div>{$t('weather.wind')}</div>
          <div>{$t('weather.gust')}</div>
        </th>
        <th scope="col" class="px-4 py-3 text-right">
          <div>{$t('weather.humidity')}</div>
          <div>{$t('weather.visibility')}</div>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each data.weatherForecast as itm, idx}
        {@const dt = new Date(itm.timestamp * 1000)}
        {@const tempUnit = { metric: '°C', imperial: '°F' }[itm.units]}
        {@const speedUnit = { metric: 'km/h', imperial: 'mph' }[itm.units]}
        <tr
          class="
                border-b
                border-gray-100 odd:bg-slate-200
                even:bg-gray-200 hover:bg-gray-50
                dark:border-gray-700 dark:odd:bg-slate-800
                dark:even:bg-gray-800 dark:hover:bg-gray-900/95"
          class:border-t-8={isNewDay(itm.timestamp, data.weatherForecast[idx - 1]?.timestamp)}
        >
          <td class="whitespace-nowrap py-4 pl-6 pr-2 font-medium text-gray-900 dark:text-white">
            <div class="text-center text-slate-500">
              {dt.toLocaleDateString(data.userLang, {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit'
              })}
            </div>
            <div class="text-center">
              {dt.toLocaleTimeString(data.userLang, {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </td>
          <td class="flex flex-wrap items-center py-4 pl-0 pr-3 max-sm:text-red-500">
            <img src={itm.weather_icon_url} alt={itm.weather_text} />
            <div class="max-sm:max-w-min dark:text-white">{itm.weather_text}</div>
          </td>
          <td class="py-4 pl-1 pr-6 text-right">
            <div>
              {itm.temp}
              <span class="font-thin">{tempUnit}</span>
            </div>
            <div>
              {itm.feels_like_temp}
              <span class="font-thin">{tempUnit}</span>
            </div>
          </td>
          <td class="px-6 py-4 text-right">
            <div>
              {itm.wind_speed}
              <span class="font-thin">{speedUnit}</span>
            </div>
            <div>
              {itm.wind_gust}
              <span class="font-thin">{speedUnit}</span>
            </div>
          </td>
          <td class="px-6 py-4 text-right">
            <div>
              {itm.humidity}
              <span class="font-thin">%</span>
            </div>
            <div>
              {#if itm.visibility !== true}
                {@const km = Math.floor(itm.visibility / 1000)}
                {#if km > 0}
                  {km}
                  <span class="font-thin">km</span>
                {:else}
                  {#if itm.visibility >= 100}
                    {Math.round(itm.visibility / 100) * 100}
                  {:else}
                    {Math.round(itm.visibility / 10) * 10}
                  {/if}
                  <span class="font-bold">m</span>
                {/if}
              {:else}
                <div class="inline-flex flex-row gap-1 opacity-50">
                  <Fa icon={faBinoculars} />
                  <Fa icon={faCheckCircle} />
                </div>
              {/if}
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
