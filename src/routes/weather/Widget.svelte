<script lang="ts">
    import Fa from "svelte-fa";
    import {faEllipsis} from "@fortawesome/free-solid-svg-icons";

    export let weather: CurrentWeather

    $: { // this could be handled in onMount but then config changes would not be applied as live reload
        if (typeof window !== "undefined" && !weather)
            window.fetch('/weather/current').then(res => res.json()).then(data => {
                weather = data
            })
    }
</script>

{#if weather}
    <div class="flex"
         title="{weather.temp_c}°C (feels like {weather.feels_like_temp_c}°C)&#13;{weather.wind_kmh}km/h wind speed">
        <img src={weather.weather_icon_url} alt={weather.weather_text}>
        <div class="ml-2">
            <span class="flex items-center">
                {weather.temp_c}°C
                {#if weather.temp_c !== weather.feels_like_temp_c }
                   <span class="ml-1 flex items-center text-neutral-400 group-hover:text-red-300">
                       <span class="font-thin">(</span>{weather.feels_like_temp_c}°C<span class="font-thin">)</span>
                   </span>
                {/if}
            </span>
            <span class="flex items-center">
                {weather.weather_text}
            </span>
        </div>
    </div>
{:else}
    <Fa icon={faEllipsis} size="2x"/>
{/if}
