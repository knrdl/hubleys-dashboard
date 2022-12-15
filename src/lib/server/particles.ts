import {listFilesInFolder, readFile} from "$lib/server/fs";
import path from "path";

export async function getParticlesList() {
    return (await listFilesInFolder('particles')).map(filename => filename.replace(/\.json$/, '')).sort()
}


const _particlesCache: Record<string, any> = {}

export async function getParticlesConfig(particles: string) {
    if (!_particlesCache.hasOwnProperty(particles))
        _particlesCache[particles] = JSON.parse(await readFile(`particles/${path.basename(particles, '.json')}.json`))
    return _particlesCache[particles]
}
