import { env } from '$env/dynamic/private'
import path from 'node:path'

// Base data directory configuration
export const DATA_DIR = env.DATA_DIR || '/data'

// Individual directory configurations
// If not set, they will be subdirectories under DATA_DIR
export const USERS_DIR = env.USERS_DIR || path.join(DATA_DIR, 'users')
export const LOGOS_DIR = env.LOGOS_DIR || path.join(DATA_DIR, 'logos')
export const WALLPAPER_DIR = env.WALLPAPER_DIR || path.join(DATA_DIR, 'wallpaper')

// Common paths used throughout the application
export const PATHS = {
  CONFIG: path.join(DATA_DIR, 'config.yml'),
  LOGOS: LOGOS_DIR,
  WALLPAPER: WALLPAPER_DIR,
  USERS: {
    BACKGROUNDS: path.join(USERS_DIR, 'backgrounds'),
    CONFIG: path.join(USERS_DIR, 'config'),
    DEFAULT_CONFIG: path.join(USERS_DIR, 'default-config.json')
  },
  FAVICON: path.join(DATA_DIR, 'favicon.png')
}
