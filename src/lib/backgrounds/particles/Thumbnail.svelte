<script lang="ts">
  import type { ParticlesName } from './types'

  export let particlesName: ParticlesName
</script>

{#if particlesName === 'bubbles'}
  {#await import('./thumbnails/bubbles.png') then thumbnail}
    <img src={thumbnail.default} alt="Particles thumbnail" />
  {/await}
{:else if particlesName === 'circles'}
  {#await import('./thumbnails/circles.png') then thumbnail}
    <img src={thumbnail.default} alt="Particles thumbnail" />
  {/await}
{:else if particlesName === 'drizzle'}
  {#await import('./thumbnails/drizzle.png') then thumbnail}
    <img src={thumbnail.default} alt="Particles thumbnail" />
  {/await}
{:else if particlesName === 'leaves'}
  {#await import('./thumbnails/leaves.png') then thumbnail}
    <img src={thumbnail.default} alt="Particles thumbnail" />
  {/await}
{:else if particlesName === 'rain'}
  {#await import('./thumbnails/rain.png') then thumbnail}
    <img src={thumbnail.default} alt="Particles thumbnail" />
  {/await}
{:else if particlesName === 'snow'}
  {#await import('./thumbnails/snow.png') then thumbnail}
    <img src={thumbnail.default} alt="Particles thumbnail" />
  {/await}
{:else if particlesName === 'squares'}
  {#await import('./thumbnails/squares.png') then thumbnail}
    <img src={thumbnail.default} alt="Particles thumbnail" />
  {/await}
{:else if particlesName === 'stars'}
  {#await import('./thumbnails/stars.png') then thumbnail}
    <img src={thumbnail.default} alt="Particles thumbnail" />
  {/await}
{:else if particlesName === 'triangles'}
  {#await import('./thumbnails/triangles.png') then thumbnail}
    <img src={thumbnail.default} alt="Particles thumbnail" />
  {/await}
{:else}
  <div class="text-center text-red-700">missing thumbnail</div>
{/if}
