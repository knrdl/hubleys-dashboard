<script lang="ts">
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import '../app.css'
  import type { PageData } from './$types'
  import Header from './Header.svelte'
  import type { Engine } from '@tsparticles/engine'

  let ParticlesComponent: ConstructorOfATypedSvelteComponent

  export let data: PageData

  onMount(async () => {
    const module = await import('svelte-particles')
    ParticlesComponent = module.default
  })

  let particlesInit = async (engine: Engine) => {
    const load = (await import('tsparticles')).loadFull
    await load(engine)
  }

  function handleTheme() {
    if (data.userConfig.theme === 'dark' || (data.userConfig.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      window.document.documentElement.classList.add('dark')
    } else {
      window.document.documentElement.classList.remove('dark')
    }
  }

  let triangleCanvas: HTMLCanvasElement
  let trianglify
  $: {
    // this could be handled in onMount but then config changes would not be applied as live reload
    if (browser) {
      if (data.background?.image?.error) {
        // credentials include to accept cookie set on the server
        fetch('/background', { credentials: 'include' }).then(async res => {
          if (res.ok) data.background.image = (await res.json()).image
        })
      }

      if (data.background?.triangles) {
        ;(async () => {
          if (!trianglify) trianglify = (await import('@victorioberra/trianglify-browser/dist/trianglify.bundle')).default
          const pattern = trianglify({ width: window.innerWidth, height: window.innerHeight })
          pattern.toCanvas(triangleCanvas)
        })()
      }

      handleTheme()
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => handleTheme())
    }
  }
</script>

<div
  class="
absolute z-[-100] flex
min-h-screen flex-col items-center
bg-gradient-to-b
from-slate-200 via-blue-100 to-sky-100
dark:from-gray-700 dark:via-zinc-700 dark:to-stone-700
"
>
  {#if data.background?.image?.url}
    <div class="fixed bottom-0 left-0 right-0 top-0 z-[-90] bg-cover bg-fixed bg-center" style="background-image: url('{data.background.image.url}')"></div>
  {/if}
  {#if data.background?.triangles}
    <canvas class="fixed bottom-0 left-0 right-0 top-0 z-[-80] h-screen w-screen" bind:this={triangleCanvas}></canvas>
  {/if}
  {#if data.background?.blur === 'dark'}
    <div class="fixed bottom-0 left-0 right-0 top-0 z-[-70]" style="background: linear-gradient(to right, rgba(5, 8, 101, 0.8), rgba(0, 24, 49, 0))"></div>
  {:else if data.background?.blur === 'light'}
    <div
      class="fixed bottom-0 left-0 right-0 top-0 z-[-70]"
      style="background: linear-gradient(to right, rgba(245, 235, 235, 0.6), rgba(255, 24, 49, 0))"
    ></div>
  {/if}
  {#if data.background?.dots}
    <div
      class="fixed bottom-0 left-0 right-0 top-0 z-[-60] opacity-20"
      style="background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4IiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2IDY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPi5zdDB7ZmlsbDojRkZGRkZGO308L3N0eWxlPjxyZWN0IGNsYXNzPSJzdDAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4K') repeat;"
    ></div>
  {/if}
  {#if data.background?.particles && ParticlesComponent}
    <svelte:component this={ParticlesComponent} options={{ pauseOnBlur: true, fpsLimit: 30, ...data.background.particles }} {particlesInit} />
  {/if}
  <Header {data} />
  <slot />
</div>
