import i18n, { type Config } from 'sveltekit-i18n'

const config: Config = {
  fallbackLocale: 'en',
  initLocale: 'en',

  loaders: [
    { locale: 'en', key: 'common', loader: async () => (await import('./en/common.json')).default },
    { locale: 'en', key: 'dashboard', routes: ['/'], loader: async () => (await import('./en/dashboard.json')).default },
    { locale: 'en', key: 'settings', routes: [/^\/settings/], loader: async () => (await import('./en/settings.json')).default },
    { locale: 'de', key: 'common', loader: async () => (await import('./de/common.json')).default },
    { locale: 'de', key: 'dashboard', routes: ['/'], loader: async () => (await import('./de/dashboard.json')).default },
    { locale: 'de', key: 'settings', routes: [/^\/settings/], loader: async () => (await import('./de/settings.json')).default },
    { locale: 'es', key: 'common', loader: async () => (await import('./es/common.json')).default },
    { locale: 'es', key: 'dashboard', routes: ['/'], loader: async () => (await import('./es/dashboard.json')).default },
    { locale: 'es', key: 'settings', routes: [/^\/settings/], loader: async () => (await import('./es/settings.json')).default }
  ]
}

export const { t, loading, locales, locale, loadTranslations, setLocale, setRoute } = new i18n(config)
