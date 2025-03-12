import { env } from '$env/dynamic/private'
import path from 'node:path'

// Default to /data if DATA_DIR is not set
export const DATA_DIR = env.DATA_DIR || '/data'

// Helper functions to get paths within the data directory
export function getDataPath(...parts: string[]): string {
  return path.join(DATA_DIR, ...parts)
}

// Common paths used throughout the application
export const PATHS = {
  CONFIG: getDataPath('config.yml'),
  LOGOS: getDataPath('logos'),
  WALLPAPER: getDataPath('wallpaper'),
  USERS: {
    BACKGROUNDS: getDataPath('users', 'backgrounds'),
    CONFIG: getDataPath('users', 'config'),
    DEFAULT_CONFIG: getDataPath('users', 'default-config.json')
  },
  FAVICON: getDataPath('favicon.png')
}
