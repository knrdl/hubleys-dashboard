<script lang="ts">
  import { browser } from '$app/environment'
  import '../app.css'
  import type { LayoutData } from './$types'
  import Header from './Header.svelte'
  import { onNavigate } from '$app/navigation'
  import { blurDark, blurLight, dotMatrix } from '$lib/backgrounds/effects'
  import Trianglify from '$lib/backgrounds/Trianglify.svelte'
  import ParticlesBackground from '$lib/backgrounds/particles/Background.svelte'
  import { epoch } from '$lib/utils'

  export let data: LayoutData

  // smooth transitions between pages
  onNavigate(navigation => {
    if (!(document as any).startViewTransition) return //experimental feature
    return new Promise(resolve => {
      ;(document as any).startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })

  function handleTheme() {
    if (data.userConfig.theme === 'dark' || (data.userConfig.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
      window.document.documentElement.classList.add('dark')
    else window.document.documentElement.classList.remove('dark')
  }

  let lastBgImgLoadAttempt: number = 0

  $: {
    // this could be handled in onMount but then config changes would not be applied as live reload
    if (browser) {
      if (!data.background.triangles && !data.background.image.url) {
        if (epoch() - lastBgImgLoadAttempt > 5) {
          lastBgImgLoadAttempt = epoch()
          // credentials include to accept cookie set on the server
          fetch('/background', { credentials: 'include' }).then(async res => {
            if (res.ok) data.background.image = (await res.json()).image
          })
        }
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
bg-linear-to-b
from-slate-200 via-blue-100 to-sky-100
dark:from-gray-700 dark:via-zinc-700 dark:to-stone-700
"
>
  {#if data.background.image?.url}
    <div class="fixed top-0 right-0 bottom-0 left-0 z-[-90] bg-cover bg-fixed bg-center" style="background-image: url('{data.background.image.url}')"></div>
  {/if}
  {#if data.background.triangles}
    <Trianglify />
  {/if}
  {#if data.background.blur === 'dark'}
    <div class="fixed top-0 right-0 bottom-0 left-0 z-[-70]" style="background: {blurDark}"></div>
  {:else if data.background.blur === 'light'}
    <div class="fixed top-0 right-0 bottom-0 left-0 z-[-70]" style="background: {blurLight}"></div>
  {/if}
  {#if data.background.dots}
    <div class="fixed top-0 right-0 bottom-0 left-0 z-[-60] opacity-20" style="background: {dotMatrix} repeat;"></div>
  {/if}
  {#if data.background.particles}
    <ParticlesBackground particlesName={data.background.particles} />
  {/if}
  <Header {data} />
  <slot />
</div>
