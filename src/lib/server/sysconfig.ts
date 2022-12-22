import yaml from "js-yaml";
import {env} from '$env/dynamic/private';
import {readFile} from "$lib/server/fs";


let config: Sysconfig


async function loadConfig() {
    const isDemoMode = ['1', 'true', 'yes'].includes((env.DEMO_MODE || '').toLowerCase().trim())
    const configFile = readFile(isDemoMode ? '/app/demo/config.yml' : '/data/config.yml')
    const config = yaml.load(await configFile)
    return {
        ...config,
        demo_mode: isDemoMode,
        admin_userids: (env.ADMIN_USERIDS || '').split(/\s*[,;:]\s*/).filter(userid => !!userid),
        unsplash_api_key: env.UNSPLASH_API_KEY || null,
        openweathermap_api_key: env.OPENWEATHERMAP_API_KEY || null,
        server_request_min_timeout: parseInt(env.SERVER_REQUEST_MIN_TIMEOUT) || 750, // millisecs
    } as Sysconfig
}

export async function reloadSystemConfig() {
    config = await loadConfig()
}

export async function getConfig() {
    if (!config) config = await loadConfig()
    return config
}
