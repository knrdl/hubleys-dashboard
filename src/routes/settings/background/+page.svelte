<script lang="ts">
  import { applyAction, deserialize } from '$app/forms'
  import Fa from 'svelte-fa'
  import { faDownload, faExternalLink, faIcons, faPanorama, faPlay, faRotate } from '@fortawesome/free-solid-svg-icons'
  import SaveButton from '../SaveButton.svelte'
  import { invalidateAll } from '$app/navigation'
  import Message from '../Message.svelte'
  import type { ActionData, PageData } from './$types'
  import ParticlesThumbnail from '$lib/backgrounds/particles/Thumbnail.svelte'
  import { blurDark, blurLight, dotMatrix } from '$lib/backgrounds/effects'
  import { fade } from 'svelte/transition'
  import { t } from '$lib/translations'

  export let form: ActionData
  export let data: PageData

  let uploadImg: FileList

  async function handleSubmit(this: HTMLFormElement) {
    const body = new FormData()
    if (uploadImg?.length > 0) body.set('bgImg', uploadImg[0])
    body.set('userConfig', JSON.stringify(data.userConfig))

    const response = await fetch(this.action, { method: 'POST', body })
    const result = deserialize(await response.text())
    if (result.type === 'success') await invalidateAll()
    applyAction(result)
  }

  $: bg = data.userConfig.backgrounds[0]

  const randomImageChangeDurations = [
    { title: 'Never', value: 0 },
    { title: '10m', value: 10 * 60 },
    { title: '30m', value: 30 * 60 },
    { title: '1h', value: 60 * 60 },
    { title: '6h', value: 6 * 60 * 60 },
    { title: '12h', value: 12 * 60 * 60 },
    { title: '24h', value: 24 * 60 * 60 }
  ]
</script>

<Message text={form?.message} kind="success" />

<form method="POST" on:submit|preventDefault={handleSubmit} action="?/save">
  <header class="text-lg font-bold text-gray-900 dark:text-gray-300">{$t('settings.bg.image')}</header>
  <section class="mb-6">
    <div class="mr-10 mt-1 divide-y divide-gray-500/50 rounded border border-gray-500/50">
      <fieldset class="flex flex-wrap items-start justify-around">
        <label
          class="flex h-10 grow items-center justify-center gap-2 border-b-2 p-1 transition-colors {bg.background === 'triangles'
            ? 'border-blue-600'
            : 'border-gray-500/50'}"
        >
          <Fa icon={faPlay} rotate={270} />
          <input type="radio" hidden value="triangles" bind:group={bg.background} />
          <span>just triangles</span>
        </label>
        <div class="grow">
          <label
            class="flex h-10 items-center justify-center gap-2 border-b-2 p-1 transition-colors {bg.background === 'static'
              ? 'border-blue-600'
              : 'border-gray-500/50'}"
          >
            <Fa icon={faPanorama} />
            <input type="radio" hidden value="static" bind:group={bg.background} />
            {$t('settings.bg.image-static')}
          </label>
          {#if bg.background === 'static'}
            <div class="mb-3 mt-2 flex flex-col gap-2 pl-6" in:fade>
              <label>
                <input type="radio" class="mr-1" value="upload" bind:group={bg.static_image.source} />
                from upload
              </label>
              <label>
                <input type="radio" class="mr-1" value="web" bind:group={bg.static_image.source} />
                from the web
              </label>
            </div>
          {/if}
        </div>
        <div class="grow">
          <label
            class="flex h-10 items-center justify-center gap-2 border-b-2 p-1 transition-colors {bg.background === 'random'
              ? 'border-blue-600'
              : 'border-gray-500/50'}"
          >
            <Fa icon={faIcons} />
            <input type="radio" hidden value="random" bind:group={bg.background} />
            {$t('settings.bg.image-random')}
          </label>
          {#if bg.background === 'random'}
            <div class="mb-3 mt-2 flex flex-col gap-2 pl-6" in:fade>
              <label>
                <input type="radio" class="mr-1" value="unsplash" bind:group={bg.random_image.provider} />
                Unsplash photo library
              </label>
              <label>
                <input type="radio" class="mr-1" value="reddit" bind:group={bg.random_image.provider} />
                Reddit posts
              </label>
              <label>
                <input type="radio" class="mr-1" value="nasa" bind:group={bg.random_image.provider} />
                NASA
              </label>
            </div>
          {/if}
        </div>
      </fieldset>
      {#if bg.background !== 'triangles'}
        <div class="p-3">
          {#if bg.background === 'static' && bg.static_image.source === 'upload'}
            <div class="flex flex-wrap justify-between">
              {#if bg.static_image.upload_url}
                <a href="/background/{bg.static_image.upload_url}" target="_blank" rel="noopener noreferrer" class="icon-button">
                  <Fa icon={faExternalLink} />
                  Show current image
                </a>
              {:else}
                <div />
              {/if}
              <label class="cursor-pointer">
                Upload new image:
                <input type="file" bind:files={uploadImg} accept="image/*" />
              </label>
            </div>
          {:else if bg.background === 'static' && bg.static_image.source === 'web'}
            <label class="flex items-center gap-2">
              Image URL:
              <input type="url" class="grow" placeholder="please enter image url" bind:value={bg.static_image.web_url} />
            </label>
          {:else if bg.background === 'random' && bg.random_image.provider === 'unsplash'}
            <label class="mb-2 flex items-center gap-2">
              Query:
              <input type="text" class="grow" placeholder="e.g. beach" bind:value={bg.random_image.unsplash_query} />
            </label>
          {:else if bg.background === 'random' && bg.random_image.provider === 'reddit'}
            <label class="mb-2 flex items-center gap-2">
              Subreddits:
              <input type="text" class="grow" placeholder="e.g. wallpaper,wallpapers" bind:value={bg.random_image.subreddits} />
            </label>
          {/if}
          {#if bg.background === 'random'}
            <label class="flex items-center gap-2">
              Change every:
              <select bind:value={bg.random_image.duration} class="w-20">
                {#each randomImageChangeDurations as duration}
                  <option value={duration.value}>{duration.title}</option>
                {/each}
              </select>
            </label>
            <div class="flex items-center justify-end gap-2">
              <button type="submit" formaction="?/reload-random-background-image" class="icon-button">
                <Fa icon={faRotate} />
                Shuffle
              </button>
              {#if data.background?.image?.url}
                <a href={data.background.image.url} target="_blank" rel="noopener noreferrer" class="icon-button">
                  <Fa icon={faDownload} />
                  Download
                </a>
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </section>

  <header class="text-lg font-bold text-gray-900 dark:text-gray-300">{$t('settings.bg.effects')}</header>
  <section class="mb-6">
    <div class="flex flex-wrap justify-around gap-3">
      <fieldset class="flex flex-wrap items-center justify-center gap-4">
        <label class="flex flex-col items-center gap-1 rounded p-2 transition-colors {bg.blur === false ? 'bg-slate-500/50 shadow-inner' : ''}">
          <div>
            <input type="radio" class="mr-1" value={false} bind:group={bg.blur} />
            {$t('settings.bg.no-blur')}
          </div>
          <div class="h-12 w-24 rounded bg-white shadow shadow-slate-300 dark:bg-slate-800 dark:shadow-slate-700"></div>
        </label>
        <label class="flex flex-col items-center gap-1 rounded p-2 transition-colors {bg.blur === 'dark' ? 'bg-slate-500/50 shadow-inner' : ''}">
          <div>
            <input type="radio" class="mr-1" value="dark" bind:group={bg.blur} />
            {$t('settings.bg.dark-blur')}
          </div>
          <div class="h-12 w-24 rounded shadow shadow-slate-300 dark:shadow-slate-700" style="background: {blurDark}"></div>
        </label>
        <label class="flex flex-col items-center gap-1 rounded p-2 transition-colors {bg.blur === 'light' ? 'bg-slate-500/50 shadow-inner' : ''}">
          <div>
            <input type="radio" class="mr-1" value="light" bind:group={bg.blur} />
            {$t('settings.bg.light-blur')}
          </div>
          <div class="h-12 w-24 rounded shadow shadow-slate-300 dark:shadow-slate-700" style="background: {blurLight}"></div>
        </label>
      </fieldset>
      <label class="rounded p-2 transition-colors {bg.dots ? 'bg-slate-500/50 shadow-inner' : ''}">
        <div>
          <input type="checkbox" class="mr-1" bind:checked={bg.dots} />
          {$t('settings.bg.dot-matrix')}
        </div>
        <div class="mt-1 h-12 w-24 rounded-sm border border-slate-100/80 opacity-25 invert dark:invert-0" style="background: {dotMatrix} repeat"></div>
      </label>
    </div>
  </section>
  <header class="text-lg font-bold text-gray-900 dark:text-gray-300">{$t('settings.bg.particles')}</header>
  <section>
    <fieldset class="flex flex-wrap items-center justify-center">
      {#each [false, ...data.particleList] as particlesName}
        <label
          class="mx-3 mb-3 flex flex-col items-center rounded p-2 transition-colors {bg.particles === particlesName ? 'bg-slate-500/50 shadow-inner' : ''}"
        >
          <input type="radio" hidden value={particlesName} bind:group={bg.particles} />
          <div class="mask h-24 w-24 {particlesName ? 'bg-blue-600' : 'bg-blue-600/50'} shadow-inner drop-shadow">
            {#if typeof particlesName !== 'boolean'}
              <ParticlesThumbnail {particlesName} />
            {/if}
          </div>
          {$t(`settings.bg.particleslist.${particlesName || ''}`)}
        </label>
      {/each}
    </fieldset>
  </section>

  <div class="flex justify-end">
    <SaveButton />
  </div>
</form>

<style lang="postcss">
  section {
    @apply ml-6;
  }

  label {
    @apply cursor-pointer text-gray-800 dark:text-gray-300;
  }

  .mask {
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjAwJyBoZWlnaHQ9JzE4MicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNNjQuNzg2IDE4MS40Yy05LjE5NiAwLTIwLjA2My02LjY4Ny0yNS4wNzktMTQuMjFMMy43NjIgMTA1LjMzYy01LjAxNi04LjM2LTUuMDE2LTIwLjkgMC0yOS4yNTlsMzUuOTQ1LTYxLjg2QzQ0LjcyMyA1Ljg1MSA1NS41OSAwIDY0Ljc4NiAwaDcxLjA1NWM5LjE5NiAwIDIwLjA2MyA2LjY4OCAyNS4wNzkgMTQuMjExbDM1Ljk0NSA2MS44NmM0LjE4IDguMzYgNC4xOCAyMC44OTkgMCAyOS4yNThsLTM1Ljk0NSA2MS44NmMtNC4xOCA4LjM2LTE1Ljg4MyAxNC4yMTEtMjUuMDc5IDE0LjIxMUg2NC43ODZaJyBmaWxsPSdibGFjaycgZmlsbC1ydWxlPSdub256ZXJvJy8+PC9zdmc+);
  }

  label input[type='text'],
  label input[type='url'],
  label input[type='file'],
  label select {
    @apply rounded-lg border border-gray-300 bg-gray-50 p-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400;
  }

  input[type='file']::file-selector-button {
    display: none;
  }

  .icon-button {
    @apply flex items-center justify-center gap-1 rounded-lg bg-blue-700/80 p-1 text-center text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-600/80 dark:hover:bg-blue-700;
  }
</style>
