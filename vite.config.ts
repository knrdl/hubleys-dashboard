import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [tailwindcss(),sveltekit(), ],
  server: {
    host: '0.0.0.0'
  },
  ssr: {
    noExternal: ['tsparticles', 'tsparticles-slim', 'tsparticles-engine', 'svelte-particles', '@tsparticles/svelte'] // add all tsparticles libraries here, they're not made for SSR, they're client only
  }
})
