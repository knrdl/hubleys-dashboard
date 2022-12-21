interface BackgroundRule {
    when: true | {
        hour_gt?: number
        hour_lt?: number,
        weekday_in?: {
            mon: boolean,
            tue: boolean,
            wed: boolean,
            thu: boolean,
            fri: boolean,
            sat: boolean,
            sun: boolean
        }
        current_weather?: WeatherConditions
        current_temperature_gt?: number
        current_temperature_lt?: number
    }
    show: {
        static_image: {
            format: 'id' | 'url'
            value: string
        }
        random_image: {
            query: string
            duration: number
        }
        background: 'triangles' | 'static' | 'random'
        blur: false | 'dark' | 'light'
        dots: boolean
        particles: false | string
    }
}

interface UserConfig {
    version: number
    theme: 'system' | 'light' | 'dark'
    language: string | null
    weather: {
        zip_code: string | null,
        country_code: string | null,
        lon: number | null,
        lat: number | null,
        mode: 'zip' | 'lonlat'
        show: boolean
    }
    clock: { show: boolean }
    calendar: { show: boolean }
    searchbar: { show: boolean }
    dashboard: { show_settings_text: boolean }
    background_rules: BackgroundRule[]
}

interface RequestUserInfo {
    userid: string
    email: string | null
    username: string | null
    groups: string[]
    isAdmin: boolean
    lang: string
}

interface Tile {
    title: string
    url?: string
    logo?: string
    emoji?: string
    display?: 'icon-only'
    menu?: Tile[]
}

interface SearchEngine {
    title: string
    search_url: string
    autocomplete_url?: string
}

interface Calendar {
    source_url: string
    display_url?: string
}

type SysconfigAllow = boolean | string[]

interface Sysconfig {
    tiles: (Tile & {
        allow: SysconfigAllow
    })[]
    search_engines: (SearchEngine & { allow: SysconfigAllow })[]
    calendars: (Calendar & { allow: SysconfigAllow })[]
    admin_userids: string[]
    unsplash_api_key: string | null
    openweathermap_api_key: string | null

    demo_mode: boolean
}
