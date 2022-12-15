<script lang="ts">
    export let weather: {
        wind_kmh: number,
        weather_text: string,
        weather_icon_url: string,
        visibility_meters: number,
        temp_c: number,
        feels_like_temp_c: number,
        temp_min_c: number,
        temp_max_c: number,
    } // todo: type defs
</script>

<div class="flex"
     title="{weather.temp_c}°C (feels like {weather.feels_like_temp_c}°C)&#13;{weather.wind_kmh}km/h wind speed">
    <img src={weather.weather_icon_url} alt={weather.weather_text}>
    <div class="ml-2">
        <span class="flex items-center">
            {weather.temp_c}°C
            {#if weather.temp_c !== weather.feels_like_temp_c }
               <span class="ml-1 flex items-center text-neutral-400">
                   <span class="font-thin">(</span>{weather.feels_like_temp_c}°C<span class="font-thin">)</span>
               </span>
            {/if}
        </span>
        <span class="flex items-center">
            {weather.weather_text}
        </span>
    </div>
</div>
