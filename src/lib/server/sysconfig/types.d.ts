export interface Tile {
  title: string
  subtitle?: string
  url?: string
  logo?: string
  emoji?: string
  display?: 'icon-only'
  menu?: {
    title: string
    subtitle?: string
    tiles: Tile[]
  }
}

export interface SearchEngine {
  title: string
  search_url: string
  autocomplete_url?: string
}

export interface Calendar {
  url: string
}

export interface Message {
  html: string
}

export type AccessRule = boolean | (`user:${string}` | `group:${string}` | `mail:${string}` | `email:${string}`)[]

export interface AccessConfig {
  allow?: AccessRule
  deny?: AccessRule
}

export interface SysconfigTile extends Tile, AccessConfig {
  menu?: (Tile['menu'] & { tiles: SysconfigTile[] }) & AccessConfig
}

export interface Sysconfig {
  tiles: SysconfigTile[]
  search_engines: (SearchEngine & AccessConfig)[]
  calendars: (Calendar & AccessConfig)[]
  messages: (Message & AccessConfig)[]
  admin_userids: string[]
  unsplash_api_key: string | null
  openweathermap_api_key: string | null
  userHttpHeaders: {
    userid: string
    email: string
    username: string
    groups: string
  }

  server_request_timeout: number

  appInfo: {
    buildDate: string
    version: string
  }

  demo_mode: boolean
}
