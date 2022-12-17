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
        current_weather?: 'Thunderstorm' | 'Drizzle' | 'Rain' | 'Snow' | 'Mist' | 'Smoke' | 'Haze' | 'Dust' | 'Fog' | 'Sand' | 'Ash' | 'Squall' | 'Tornado' | 'Clear' | 'Clouds'
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
    settings: { big_icon: boolean }
    background_rules: BackgroundRule[]
}

interface RequestUserInfo {
    userid: string
    email: string | null
    groups: string[]
    isAdmin: boolean
    lang: string
}

interface TileMenuItem {
    title: string
    url: string
    logo?: string
    emoji?: string
}

interface Tile {
    title: string
    url?: string
    logo?: string
    emoji?: string
    menu?: TileMenuItem[]
}

interface SearchEngine {
    title: string
    search_url: string
    autocomplete_url?: string
}

interface Calendar {
    source_url: string
    display_url: string
    username?: string
    password?: string
}

interface Tile {
    title: string
    url: string
    emoji?: string
    logo?: string
    allow?: boolean | string[]

    display?: 'icon-only'
}

interface Sysconfig {
    tiles: (Tile & {
        url?: string
        menu?: Tile[]
    })[]
    search_engines: { title: string, search_url: string, autocomplete_url?: string, allow?: boolean | string[] }[]
    calendars: { source_url: string, display_url: string, username?: string, password?: string, allow?: boolean | string[] }[]
    admin_userids: string[]
    unsplash_api_key: string | null
    openweathermap_api_key: string | null
}


// todo: better names for types
