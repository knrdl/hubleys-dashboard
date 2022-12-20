type WeatherConditions =
    'Thunderstorm'
    | 'Drizzle'
    | 'Rain'
    | 'Snow'
    | 'Mist'
    | 'Smoke'
    | 'Haze'
    | 'Dust'
    | 'Fog'
    | 'Sand'
    | 'Ash'
    | 'Squall'
    | 'Tornado'
    | 'Clear'
    | 'Clouds'

interface CurrentWeather {
    wind_kmh: number,
    weather_type: WeatherConditions,
    weather_text: string,
    weather_icon_url: string,
    visibility_meters: number | true,
    temp_c: number,
    feels_like_temp_c: number,
    temp_min_c: number,
    temp_max_c: number,
}
