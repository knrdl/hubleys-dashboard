<script lang="ts">
  import Fa from 'svelte-fa'
  import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
  import { browser } from '$app/environment'
  import type { CurrentWeather } from './types'
  import { t } from '$lib/translations'

  export let weather: CurrentWeather | null

  $: {
    // this could be handled in onMount but then config changes would not be applied as live reload
    if (browser && !weather)
      window
        .fetch('/weather/current')
        .then(res => res.json())
        .then(data => {
          weather = data
        })
  }
</script>

{#if weather}
  {@const tempUnit = { metric: '°C', imperial: '°F' }[weather.units]}
  {@const speedUnit = { metric: 'km/h', imperial: 'mph' }[weather.units]}
  <div
    class="flex"
    title="{weather.temp}{tempUnit} ({$t('weather.feelslike')} {weather.feels_like_temp}{tempUnit})&#13;{$t('weather.wind')}: {weather.wind_speed}{speedUnit}"
  >
    <img src={weather.weather_icon_url} alt={weather.weather_text} />
    <div class="ml-2">
      <span class="flex items-center">
        {weather.temp}{tempUnit}
        {#if weather.temp !== weather.feels_like_temp}
          <span class="ml-1 flex items-center text-neutral-400 group-hover:text-red-300">
            <span class="font-thin">[</span>{weather.feels_like_temp}{tempUnit}<span class="font-thin">]</span>
          </span>
        {/if}
      </span>
      <span class="flex items-center">
        {weather.weather_text}
      </span>
    </div>
  </div>
{:else}
  <Fa icon={faEllipsis} size="2x" />
{/if}
