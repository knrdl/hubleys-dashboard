const particles: Record<ParticleName, any> = {
  bubbles: async () => (await import('./bubbles.json')).default,
  circles: async () => (await import('./circles.json')).default,
  rain: async () => (await import('./rain.json')).default,
  snow: async () => (await import('./snow.json')).default,
  triangles: async () => (await import('./triangles.json')).default
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
