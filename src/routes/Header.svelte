<script lang="ts">
    import CalendarWidget from "$lib/widgets/Calendar.svelte";
    import ClockWidget from "$lib/widgets/Clock.svelte";
    import WeatherWidget from "$lib/widgets/Weather.svelte";

    export let data
</script>

<!--todo: screen corners instead of flexbox-->
<header class="flex justify-between w-screen sticky top-0 items-start">
    {#if data.userConfig?.weather.show}
        {#if data.currentWeather}
            <a class="pl-2 pt-1 pr-3 pb-1 select-none bg-slate-900/80 hover:bg-slate-900 text-slate-100 rounded-br-md"
               href="/weather">
                <WeatherWidget weather={data.currentWeather}/>
            </a>
        {:else}
            <a class="pl-2 pt-1 pr-3 pb-1 select-none bg-slate-900/80 hover:bg-slate-900 text-slate-100 rounded-br-md"
               href="/settings/weather">Configure<br/>Weather</a>
        {/if}
    {/if}
    {#if data.userConfig?.clock.show}
        <a class="pl-3 pt-1 pr-3 pb-1 select-none bg-slate-900/80 hover:bg-slate-900 text-slate-100 rounded-b-md"
           href="/clock/stopwatch">
            <ClockWidget userLang={data.userLang}/>
        </a>
    {/if}
    {#if data.userConfig?.calendar.show && data.calendar.display_url}
        <a href={data.calendar.display_url} target="_blank" rel="noopener noreferrer"
           class="pl-3 pt-1 pr-2 pb-1 select-none bg-slate-900/80 hover:bg-slate-900 text-slate-100 rounded-bl-md">
            <CalendarWidget calendar={data.calendar}/>
        </a>
    {/if}
</header>
