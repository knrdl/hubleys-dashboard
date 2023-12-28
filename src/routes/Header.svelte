<script lang="ts">
  import ClockWidget from './clock/Widget.svelte'
  import WeatherWidget from './weather/Widget.svelte'
  import { page } from '$app/stores'
  import Fa from 'svelte-fa'
  import { faCog, faHome, faWrench } from '@fortawesome/free-solid-svg-icons'
  import type { LayoutData } from './$types'
  import { t } from '$lib/translations'

  export let data: LayoutData
</script>

<header class="flex w-screen items-start justify-between overflow-hidden max-[380px]:flex-col max-[380px]:gap-1">
  {#if data.userConfig.weather.show && data.currentWeather !== 'NOT_ENABLED'}
    {#if data.currentWeather === 'NOT_CONFIGURED'}
      <a class="flex items-center gap-1 rounded-br-md pb-1 pl-2 pr-3 pt-1" href="/settings/weather">
        <Fa icon={faWrench} />
        {$t('common.weather')}
      </a>
    {:else if typeof data.currentWeather !== 'string'}
      <a class="rounded-br-md pb-1 pl-2 pr-3 pt-1" href="/weather">
        <WeatherWidget weather={data.currentWeather} />
      </a>
    {/if}
  {/if}
  {#if $page.url.pathname === '/'}
    <a href="/settings" class="flex items-center gap-1 rounded-b-md px-2 py-1">
      <Fa icon={faCog} />
      {#if data.userConfig.dashboard.show_settings_text}
        {$t('common.settings')}
      {/if}
    </a>
  {:else}
    <a href="/" class="flex items-center gap-1 rounded-b-md px-2 pb-2 pt-1">
      <Fa icon={faHome} />
      {#if data.userConfig.dashboard.show_settings_text}
        {$t('common.home')}
      {/if}
    </a>
  {/if}
  {#if data.userConfig.clock.show}
    <a class="rounded-bl-md pb-1 pl-3 pr-2 pt-1" href="/clock/stopwatch">
      <ClockWidget userLang={data.userLang} />
    </a>
  {/if}
</header>

<style lang="postcss">
  a {
    @apply z-[10] select-none bg-slate-900/80 text-slate-100 hover:scale-105 hover:bg-slate-900 hover:text-blue-400 max-[380px]:w-full;
  }
</style>
