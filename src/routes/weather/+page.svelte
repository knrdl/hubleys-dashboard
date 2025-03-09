<script lang="ts">
  import Fa from 'svelte-fa'
  import { faSun, faUpLong, faDownLong } from '@fortawesome/free-solid-svg-icons'
  import { fly } from 'svelte/transition'
  import type { PageData } from './$types'
  import { t } from '$lib/translations'
  import LineChart from './LineChart.svelte'

  export let data: PageData

  let selectedIdx: number | null = null

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

<div class="w-screen justify-center gap-20 lg:flex">
  <div class="my-3 max-w-[33rem] grow">
    <div class="sticky top-0">
      <LineChart
        source1={{ legend: $t('weather.temperature'), data: data.weatherForecast.map(fc => fc.temp) }}
        source2={{ legend: $t('weather.feelslike'), data: data.weatherForecast.map(fc => fc.feels_like_temp) }}
        unit="°"
        timestamps={data.weatherForecast.map(fc => fc.timestamp)}
        userLang={data.userLang}
        {selectedIdx}
        class="rounded-t bg-slate-300/85 px-8 py-4 pt-8 dark:bg-slate-900/85"
      />
      <LineChart
        source1={{ legend: $t('weather.wind'), data: data.weatherForecast.map(fc => fc.wind_speed) }}
        source2={{ legend: $t('weather.gust'), data: data.weatherForecast.map(fc => fc.wind_gust) }}
        unit=""
        timestamps={data.weatherForecast.map(fc => fc.timestamp)}
        userLang={data.userLang}
        {selectedIdx}
        class="bg-slate-300/85 px-8 py-4 dark:bg-slate-900/85"
      />
      <LineChart
        source1={{ legend: $t('weather.humidity'), data: data.weatherForecast.map(fc => fc.humidity) }}
        unit="%"
        timestamps={data.weatherForecast.map(fc => fc.timestamp)}
        userLang={data.userLang}
        {selectedIdx}
        class="bg-slate-300/85 px-8 py-4 dark:bg-slate-900/85"
      />
      <LineChart
        source1={{ legend: $t('weather.pressure'), data: data.weatherForecast.map(fc => fc.pressure) }}
        unit=""
        timestamps={data.weatherForecast.map(fc => fc.timestamp)}
        userLang={data.userLang}
        {selectedIdx}
        class="rounded-b bg-slate-300/85 px-8 py-4 dark:bg-slate-900/85"
      />
    </div>
  </div>
  <div class="my-3 rounded-lg bg-slate-300/90 p-1 drop-shadow-sm dark:bg-slate-900/90" in:fly={{ y: -20 }}>
    <table class="w-full border-b-8 border-gray-100 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <thead class="sticky top-0 bg-gray-400 text-xs text-gray-700 uppercase dark:bg-black/90 dark:text-gray-400">
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
            <div>{$t('weather.pressure')}</div>
          </th>
        </tr>
      </thead>
      <tbody on:mouseleave={() => (selectedIdx = null)} on:blur={() => (selectedIdx = null)}>
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
            on:mouseenter={() => (selectedIdx = idx)}
          >
            <td class="py-4 pr-2 pl-6 font-medium whitespace-nowrap text-gray-900 dark:text-white">
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
            <td class="flex flex-wrap items-center py-4 pr-3 pl-0 max-sm:text-red-500">
              <img src={itm.weather_icon_url} alt={itm.weather_text} />
              <div class="max-sm:max-w-min dark:text-white">
                <div>
                  {itm.weather_text}
                </div>
                <div>
                  {#if itm.visibility !== true}
                    {$t('weather.visibility')}:
                    {@const km = Math.floor(itm.visibility / 1000)}
                    {#if km > 0}
                      {km.toLocaleString(data.userLang)}<span class="font-thin">km</span>
                    {:else}
                      {itm.visibility}<span class="font-bold">m</span>
                    {/if}
                  {/if}
                </div>
              </div>
            </td>
            <td class="py-4 pr-6 pl-1 text-right">
              <div>
                {itm.temp}&thinsp;<span class="font-thin tracking-tighter">{tempUnit}</span>
              </div>
              <div>
                {itm.feels_like_temp}&thinsp;<span class="font-thin tracking-tighter">{tempUnit}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div>
                {itm.wind_speed}&thinsp;<span class="font-thin tracking-tighter">{speedUnit}</span>
              </div>
              <div>
                {itm.wind_gust}&thinsp;<span class="font-thin tracking-tighter">{speedUnit}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div>
                {itm.humidity}&thinsp;<span class="font-thin tracking-tighter">%</span>
              </div>
              <div>
                {itm.pressure.toLocaleString(data.userLang)}&thinsp;<span class="font-thin tracking-tighter">hPa</span>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
