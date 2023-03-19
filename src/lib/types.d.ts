interface BackgroundConfig {
    static_image: {
        source: 'upload' | 'web'
        upload_url: string
        web_url: string
        upload_img?: FileList
    }
    random_image: {
        provider: 'unsplash' | 'reddit',
        unsplash_query: '',
        subreddits: '',
        duration: 0
    }
    background: 'triangles' | 'static' | 'random'
    blur: false | 'dark' | 'light'
    dots: boolean
    particles: false | string
    selected: boolean
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
    backgrounds: BackgroundConfig[]
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
    url: string
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
