import {listFilesInFolder} from "$lib/server/fs";

export async function getParticlesList() {
    return (await listFilesInFolder('particles')).map(filename => filename.replace(/\.json$/, '')).sort()
}


// todo: loading a particles file should also be handled here
