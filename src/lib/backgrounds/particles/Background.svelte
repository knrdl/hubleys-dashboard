<script lang="ts">
  import { onMount } from 'svelte'
  import { getParticles } from '.'
  import type { ParticlesName } from './types'
  import { particlesInit } from '@tsparticles/svelte'
  import { loadFull } from 'tsparticles'
  import { type Engine } from '@tsparticles/engine'

  export let particlesName: ParticlesName

  void particlesInit(async (engine: Engine) => {
    await loadFull(engine)
  })

  let ParticlesComponent: any

  onMount(async () => {
    const module = await import('@tsparticles/svelte')
    ParticlesComponent = module.default
  })
</script>

{#if particlesName}
  {#await getParticles(particlesName) then particles}
    {#if ParticlesComponent}
      <svelte:component
        this={ParticlesComponent}
        options={{ pauseOnBlur: true, pauseOnOutsideViewport: true, fpsLimit: 30, detectRetina: true, ...particles }}
      />
    {/if}
  {/await}
{/if}
