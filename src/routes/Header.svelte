<script lang="ts">
    import ClockWidget from "$lib/widgets/Clock.svelte";
    import WeatherWidget from "$lib/widgets/Weather.svelte";
    import {page} from '$app/stores';
    import Fa from "svelte-fa";
    import {faCog, faHome, faHouse, faWrench} from "@fortawesome/free-solid-svg-icons";

    export let data
</script>

<header class="flex justify-between w-screen top-0 items-start max-[380px]:flex-col max-[380px]:gap-1">
    {#if data.userConfig?.weather.show}
        {#if data.currentWeather}
            <a class="pl-2 pt-1 pr-3 pb-1 rounded-br-md"
               href="/weather">
                <WeatherWidget weather={data.currentWeather}/>
            </a>
        {:else}
            <a class="pl-2 pt-1 pr-3 pb-1 rounded-br-md flex items-center gap-1"
               href="/settings/weather">
                <Fa icon={faWrench}/>
                Weather
            </a>
        {/if}
    {/if}
    {#if $page.url.pathname === '/' }
        <a href="/settings/widgets"
           class="py-1 px-2 rounded-b-md flex items-center gap-1">
            <Fa icon={faCog}/>
            {#if data.userConfig?.dashboard.show_settings_text}
                Settings
            {/if}
        </a>
    {:else}
        <a href="/"
           class="py-1 px-2 rounded-b-md flex items-center gap-1">
            <Fa icon={faHome}/>
            {#if data.userConfig?.dashboard.show_settings_text}
                Home
            {/if}
        </a>
    {/if}
    {#if data.userConfig?.clock.show}
        <a class="pl-3 pt-1 pr-2 pb-1 rounded-bl-md"
           href="/clock/stopwatch">
            <ClockWidget userLang={data.userLang}/>
        </a>
    {/if}
</header>

<style>
    a {
        @apply select-none bg-slate-900/80 hover:bg-slate-900 text-slate-100 hover:text-blue-400 hover:scale-105 max-[380px]:w-full;
    }
</style>
