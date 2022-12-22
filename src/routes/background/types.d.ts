type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0=sunday, 1=monday, ...

type BackgroundRuleCriterion =
    { condition: 'weather', values: WeatherConditions[] } |
    { condition: 'temperature', values: [number, number][] } |
    { condition: 'hour', values: [number, number][] } |
    { condition: 'weekday', values: Weekday[] }

interface BackgroundRule {
    when: BackgroundRuleCriterion[]
    show: {
        static_image: {
            format: 'id' | 'url'
            value: string
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
    }
}
