import yaml from "js-yaml";
// import {Validator} from "jsonschema";
import {env} from '$env/dynamic/private';
import {readFile} from "$lib/server/fs";


let config: Sysconfig


async function loadConfig() {
    const configFile = readFile('config.yml')
    // const schemaFile = readFile('config.schema.json')
    const config = yaml.load(await configFile)
    // const schema = JSON.parse(await schemaFile) // todo
    // const validation = new Validator().validate(tiles, schema)
    // if (!validation.valid) throw new Error(validation.errors.toString())
    return {
        ...config,
        admin_userids: (env.ADMIN_USERIDS || '').split(/\s*[,;:]\s*/).filter(userid => !!userid),
        unsplash_api_key: env.UNSPLASH_API_KEY || null,
        openweathermap_api_key: env.OPENWEATHERMAP_API_KEY || null,
    } as Sysconfig
}

export async function reloadSystemConfig() {
    config = await loadConfig()
}

export async function getConfig() {
    if (!config) config = await loadConfig()
    return config
}
