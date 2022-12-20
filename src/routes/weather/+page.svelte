<script lang="ts">
    import Fa from 'svelte-fa'
    import {faBinoculars, faCheckCircle, faSun, faUpLong, faDownLong} from '@fortawesome/free-solid-svg-icons'
    import {fly} from 'svelte/transition';

    export let data

    function isNewDay(oldTimestamp: number, newTimestamp: number) {
        if (!oldTimestamp || !newTimestamp) return false
        const oldTs = new Date(oldTimestamp * 1000)
        const newTs = new Date(newTimestamp * 1000)
        return oldTs.getDay() !== newTs.getDay()
    }

    function fmtTime(epoch: number) {
        return new Date(epoch * 1000).toLocaleTimeString(data.userLang, {hour: '2-digit', minute: '2-digit'})
    }
</script>

<svelte:head>
    <title>Weather</title>
</svelte:head>

<div class="rounded-lg my-3 drop-shadow p-1 bg-slate-300/90 dark:bg-slate-900/90" in:fly={{y:-20}}>
    <table class="w-full text-left text-gray-500 dark:text-gray-400 border-b-8 border-gray-100 dark:border-gray-700">
        <thead class="text-xs text-gray-700 uppercase bg-gray-400 dark:bg-black/90 dark:text-gray-400 sticky top-0">
        <tr>
            <th colspan="3" scope="col" class="py-3 px-4">
                <div class="flex justify-between">
                    <div class="flex flex-col items-start ml-3">
                        <div class="flex items-center gap-1">
                            <Fa icon={faSun}/>
                            <Fa icon={faUpLong}/>
                            <span>{fmtTime(data.currentWeather.sunrise_epoch)}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <Fa icon={faSun}/>
                            <Fa icon={faDownLong}/>
                            <span>{fmtTime(data.currentWeather.sunset_epoch)}</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-end">
                        <div>Temperature</div>
                        <div class="font-normal">(feels like)</div>
                    </div>
                </div>
            </th>
            <th scope="col" class="py-3 px-4 text-right">
                <div>Wind</div>
                <div>Gust</div>
            </th>
            <th scope="col" class="py-3 px-4 text-right">
                <div>Humidity</div>
                <div>Visibility</div>
            </th>
        </tr>
        </thead>
        <tbody>
        {#each data.weatherForecast as itm, idx}
            {@const dt = new Date(itm.timestamp * 1000)}
            <tr class="
                border-b
                even:bg-gray-200 odd:bg-slate-200
                dark:even:bg-gray-800 dark:odd:bg-slate-800
                border-gray-100 hover:bg-gray-50
                dark:border-gray-700 dark:hover:bg-gray-900/95"
                class:border-t-8={isNewDay(itm.timestamp, data.weatherForecast[idx - 1]?.timestamp)}>
                <td class="py-4 pl-6 pr-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div class="text-center text-slate-500">{dt.toLocaleDateString(data.userLang, {
                        year: '2-digit', month: '2-digit', day: '2-digit'
                    })}</div>
                    <div class="text-center">{dt.toLocaleTimeString(data.userLang, {
                        hour: '2-digit', minute: '2-digit'
                    })}</div>
                </td>
                <td class="py-4 pl-0 pr-3 flex flex-wrap items-center max-sm:text-red-500">
                    <img src={itm.weather_icon_url} alt={itm.weather_text}>
                    <div class="dark:text-white max-sm:max-w-min">{itm.weather_text}</div>
                </td>
                <td class="py-4 pl-1 pr-6 text-right">
                    <div>{itm.temp_c}
                        <span class="font-thin">°C</span>
                    </div>
                    <div>{itm.feels_like_temp_c}
                        <span class="font-thin">°C</span>
                    </div>
                </td>
                <td class="py-4 px-6 text-right">
                    <div>{itm.wind_speed_kmh}
                        <span class="font-thin">km/h</span>
                    </div>
                    <div>{itm.wind_gust_kmh}
                        <span class="font-thin">km/h</span>
                    </div>
                </td>
                <td class="py-4 px-6 text-right">
                    <div>{itm.humidity_percent}
                        <span class="font-thin">%</span>
                    </div>
                    <div>
                        {#if itm.visibility_meters !== true}
                            {@const km = Math.floor(itm.visibility_meters / 1000)}
                            {#if km > 0}
                                {km}
                                <span class="font-thin">km</span>
                            {:else}
                                {#if itm.visibility_meters >= 100}
                                    {Math.round(itm.visibility_meters / 100) * 100}
                                {:else}
                                    {Math.round(itm.visibility_meters / 10) * 10}
                                {/if}
                                <span class="font-bold">m</span>
                            {/if}
                        {:else}
                            <div class="inline-flex flex-row gap-1 opacity-50">
                                <Fa icon={faBinoculars}/>
                                <Fa icon={faCheckCircle}/>
                            </div>
                        {/if}
                    </div>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>

