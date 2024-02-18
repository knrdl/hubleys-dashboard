export interface Tile {
  title: string
  subtitle?: string
  url?: string | { value: string; target?: 'new-tab' | 'same-tab' | '_self' | '_blank' | '_parent' | '_top' }
  logo?: string
  emoji?: string
  only_icon?: boolean
  menu?: {
    title: string
    subtitle?: string
    tiles: Tile[]
  }
}

export interface Section {
  title?: string
  subtitle?: string
  tiles: Tile[]
}

export interface SearchEngine {
  title: string
  search_url: string
  search_parameter?: string
  autocomplete_url?: string
  target?: 'same-tab' | 'new-tab' | '_self' | '_blank' | '_parent' | '_top'
}

export interface Calendar {
  url: string
}

export interface Message {
  html: string
}

export type AccessRule = boolean | (`user:${string}` | `username:${string}` | `group:${string}` | `mail:${string}` | `email:${string}`)[]

export interface AccessConfig {
  allow?: AccessRule
  deny?: AccessRule
}

export interface SysconfigTile extends Tile, AccessConfig {
  menu?: (Tile['menu'] & { tiles: SysconfigTile[] }) & AccessConfig
}

export interface SysconfigSection extends Section, AccessConfig {
  tiles: SysconfigTile[]
}

interface BaseSysconfig {
  sections: SysconfigSection[]
  search_engines: (SearchEngine & AccessConfig)[]
  calendars: (Calendar & AccessConfig)[]
  messages: (Message & AccessConfig)[]
}

export interface FileSysconfig extends BaseSysconfig {
  tiles?: SysconfigTile[]
}

export interface Sysconfig extends BaseSysconfig {
  admins: string[]
  unsplash_api_key: string | null
  openweathermap_api_key: string | null
  userHttpHeaders: {
    userid: string
    email?: string
    username?: string
    groups?: string
    groups_separator?: string
  }

  server_request_timeout: {
    failfast: number
    max: number
  }
  httpcache_ttl: number

  logLevel: 'debug' | 'info' | 'warn' | 'error'

  appInfo: {
    buildDate: string
    version: string
  }

  single_user_mode: boolean
}
