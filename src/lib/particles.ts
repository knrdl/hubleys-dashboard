
const particles: Record<ParticleName, Function> = {
    bubbles: async () => (await import('./particles/bubbles.json')).default,
    circles: async () => (await import('./particles/circles.json')).default,
    rain: async () => (await import('./particles/rain.json')).default,
    snow: async () => (await import('./particles/snow.json')).default,
    triangles: async () => (await import('./particles/triangles.json')).default
}

export function getParticlesList() {
    return Object.keys(particles) as ParticleName[]
}

export async function getParticles(name: ParticleName) {
    if (particles[name] instanceof Function) {
        particles[name] = await particles[name]()
    }
    return particles[name] as unknown
}
