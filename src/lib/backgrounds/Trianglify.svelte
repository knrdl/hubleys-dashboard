<script lang="ts">
  import { onMount } from 'svelte'
  import trianglify from '@victorioberra/trianglify-browser/dist/trianglify.bundle'

  let triangleCanvas: HTMLCanvasElement

  onMount(async () => {
    const pattern = trianglify({ width: window.innerWidth, height: window.innerHeight })
    pattern.toCanvas(triangleCanvas)
  })
</script>

<canvas class="fixed top-0 right-0 bottom-0 left-0 z-[-80] h-screen w-screen" bind:this={triangleCanvas}></canvas>
