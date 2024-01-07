export type WeatherConditions =
  | 'Thunderstorm'
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

interface BaseWeather {
  weather_type: WeatherConditions
  weather_text: string
  weather_icon_url: string

  temp: number
  feels_like_temp: number

  wind_speed: number
  wind_gust: number
  visibility: number | true

  units: 'metric' | 'imperial'
}

export interface CurrentWeather extends BaseWeather {
  sunrise_epoch: number
  sunset_epoch: number
}

export interface WeatherForecast extends BaseWeather {
  timestamp: number

  humidity: number
  pressure: number
}
