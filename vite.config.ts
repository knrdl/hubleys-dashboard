import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: '0.0.0.0'
  },
  ssr: {
    noExternal: ['tsparticles', 'tsparticles-slim', 'tsparticles-engine', 'svelte-particles'] // add all tsparticles libraries here, they're not made for SSR, they're client only
  }
})
