<script lang="ts">
  import Fa from 'svelte-fa'
  import { faClone, faSquare, faSquareCheck, faTrashCan, faUpload } from '@fortawesome/free-solid-svg-icons'
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import type { PageData } from './$types'
  import type { BackgroundConfig } from '$lib/server/userconfig/types'

  const dispatch = createEventDispatcher()

  export let data: PageData
  export let config: BackgroundConfig

  let staticUploadImgMode: 'keep' | 'new' = 'keep'

  const RandomImageChangeDurations = [
    { title: 'Never', value: 0 },
    { title: '10m', value: 10 * 60 },
    { title: '30m', value: 30 * 60 },
    { title: '1h', value: 60 * 60 },
    { title: '6h', value: 6 * 60 * 60 },
    { title: '12h', value: 12 * 60 * 60 },
    { title: '24h', value: 24 * 60 * 60 }
  ]
</script>

<div
  class="my-3 flex divide-x divide-dashed divide-slate-600 rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
  transition:fade
>
  {#if data.userConfig.backgrounds.length > 1}
    <div class="flex flex-col justify-center gap-2 p-1">
      {#if config.selected}
        <button disabled class="icon-button">
          <Fa icon={faSquareCheck} />
          <span>Select</span>
        </button>
      {:else}
        <button on:click={() => dispatch('select')} class="icon-button">
          <Fa icon={faSquare} />
          <span>Select</span>
        </button>
      {/if}
    </div>
  {/if}
  <div class="grow px-3 py-4 font-normal text-gray-700 dark:text-gray-400">
    <div class="mb-2">
      <label>
        • Background:
        <select bind:value={config.background}>
          <option value="triangles">Triangles</option>
          <option value="static">Static Image</option>
          <option value="random">Random Image</option>
        </select>
      </label>
      {#if config.background === 'static'}
        <label>
          <span>from</span>
          <select bind:value={config.static_image.source}>
            <option value="upload">Upload</option>
            <option value="web">Web</option>
          </select>
        </label>
      {/if}
      {#if config.background === 'random'}
        <label>
          <span>from</span>
          <select bind:value={config.random_image.provider}>
            <option value="unsplash">Unsplash photo library</option>
            <option value="reddit">Reddit posts</option>
          </select>
        </label>
      {/if}
    </div>
    <div class="mb-4 ml-5">
      {#if config.background === 'random'}
        {#if config.random_image.provider === 'unsplash'}
          <label>
            Query:
            <input type="text" placeholder="e.g. beach" bind:value={config.random_image.unsplash_query} />
          </label>
        {:else if config.random_image.provider === 'reddit'}
          <label>
            Subreddits:
            <input type="text" placeholder="e.g. wallpaper,wallpapers" bind:value={config.random_image.subreddits} />
          </label>
        {/if}
        <label>
          Change after:
          <select bind:value={config.random_image.duration}>
            {#each RandomImageChangeDurations as duration}
              <option value={duration.value}>{duration.title}</option>
            {/each}
          </select>
        </label>
      {:else if config.background === 'static'}
        {#if config.static_image.source === 'upload'}
          {#if config.static_image.upload_url && staticUploadImgMode === 'keep'}
            <button class="icon-button" on:click={() => (staticUploadImgMode = 'new')}>
              <Fa icon={faUpload} />
              <span>Upload new background image</span>
            </button>
          {:else}
            <label>
              <input type="file" bind:files={config.static_image.upload_img} accept="image/*" />
            </label>
          {/if}
        {/if}
        {#if config.static_image.source === 'web'}
          <label class="flex">
            <input type="url" class="grow" placeholder="please enter image url" bind:value={config.static_image.web_url} />
          </label>
        {/if}
      {/if}
    </div>

    • Filters:
    <label class="text-sm text-gray-900 dark:text-gray-300">
      <input checked={config.blur !== false} on:change={e => (config.blur = e.currentTarget.checked ? 'dark' : false)} type="checkbox" />
      {#if config.blur === false}
        Blur
      {:else}
        Blur:
        {#if config.blur}
          <select bind:value={config.blur}>
            <option value="dark">dark</option>
            <option value="light">light</option>
          </select>
        {/if}
      {/if}
    </label>
    <label class="ml-2 text-sm text-gray-900 dark:text-gray-300">
      <input bind:checked={config.dots} type="checkbox" value="" />
      Dot Matrix
    </label>
    <label class="text-sm text-gray-900 dark:text-gray-300">
      <input
        checked={config.particles !== false}
        on:change={e => (config.particles = e.currentTarget.checked ? data.particleList[0] : false)}
        type="checkbox"
        value=""
      />
      {#if config.particles && data?.particleList}
        Particles:
        <select bind:value={config.particles}>
          {#each data.particleList as particle}
            <option value={particle}>{particle}</option>
          {/each}
        </select>
      {:else}
        Particles
      {/if}
    </label>
  </div>
  <div class="flex flex-col justify-center gap-2 p-1">
    <button on:click={() => dispatch('clone')} class="icon-button">
      <Fa icon={faClone} />
      <span>Copy</span>
    </button>
    {#if data.userConfig.backgrounds.length > 1}
      <button on:click={() => dispatch('delete')} class="icon-button">
        <Fa icon={faTrashCan} />
        <span>Delete</span>
      </button>
    {/if}
  </div>
</div>

<style lang="postcss">
  /*label required, otherwise colliding with global rules?*/
  label input[type='text'],
  label input[type='url'],
  label input[type='file'],
  label select {
    @apply rounded-lg border border-gray-300 bg-gray-50 p-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400;
  }

  .icon-button {
    @apply flex w-full flex-col justify-center gap-1;
    @apply mr-2 inline-flex items-center rounded-lg bg-blue-700/80 p-1 text-center text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-600/80 dark:hover:bg-blue-700;
  }

  .icon-button[disabled] {
    @apply bg-gray-700 hover:bg-gray-700;
  }
</style>
