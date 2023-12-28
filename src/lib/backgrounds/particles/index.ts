import type { ParticlesName } from './types'

export const particles: Record<ParticlesName, any> = {
  bubbles: async () => (await import('./definitions/bubbles.json')).default,
  circles: async () => (await import('./definitions/circles.json')).default,
  leaves: async () => (await import('./definitions/leaves.json')).default,
  rain: async () => (await import('./definitions/rain.json')).default,
  snow: async () => (await import('./definitions/snow.json')).default,
  squares: async () => (await import('./definitions/squares.json')).default,
  stars: async () => (await import('./definitions/stars.json')).default,
  triangles: async () => (await import('./definitions/triangles.json')).default
}

export function getParticlesList() {
  return Object.keys(particles) as ParticlesName[]
}

export async function getParticles(name: ParticlesName) {
  if (particles[name] instanceof Function) {
    particles[name] = await particles[name]()
  }
  return particles[name] as any
}
