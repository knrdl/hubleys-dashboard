<script lang="ts">
  import { applyAction, deserialize, enhance } from '$app/forms'
  import Fa from 'svelte-fa'
  import { faDownload, faRotate } from '@fortawesome/free-solid-svg-icons'
  import BackgroundRule from './BackgroundEditor.svelte'
  import SaveButton from '../SaveButton.svelte'
  import { invalidateAll } from '$app/navigation'
  import Message from '../Message.svelte'
  import cloneDeep from 'lodash.clonedeep'
  import type { ActionData, PageData } from './$types'

  export let form: ActionData
  export let data: PageData

  async function handleSubmit(this: HTMLFormElement) {
    const body = new FormData()
    data.userConfig.backgrounds.forEach((elem, idx) => {
      if (elem.static_image?.upload_img instanceof FileList && elem.static_image?.upload_img?.length > 0) {
        body.append('bgImg' + idx, elem.static_image?.upload_img[0])
        elem.static_image.upload_url = ''
        delete elem.static_image.upload_img
      }
    })
    body.set('userConfig', JSON.stringify(data.userConfig))

    const response = await fetch(this.action, { method: 'POST', body })
    const result = deserialize(await response.text())
    if (result.type === 'success') {
      await invalidateAll()
    }
    applyAction(result)
  }

  function cloneCfg(idx: number, config) {
    data.userConfig.backgrounds.splice(idx + 1, 0, { ...cloneDeep(config), selected: false })
    data.userConfig.backgrounds = data.userConfig.backgrounds
  }

  function selectCfg(config) {
    data.userConfig.backgrounds.forEach(bg => (bg.selected = false))
    config.selected = true
    data.userConfig.backgrounds = data.userConfig.backgrounds
  }

  function deleteCfg(idx: number) {
    const wasSelected = data.userConfig.backgrounds[idx].selected
    data.userConfig.backgrounds.splice(idx, 1)
    data.userConfig.backgrounds = data.userConfig.backgrounds
    if (wasSelected) data.userConfig.backgrounds[Math.max(idx - 1, 0)].selected = true
  }

  $: hasRandomBgImg = data.userConfig.backgrounds.find(bg => bg.selected)?.background === 'random'
</script>

<Message text={form?.message} kind="success" />

<div>
  {#if hasRandomBgImg}
    <p class="heading">Current random image</p>
    <div class="mb-5 flex items-center">
      <form method="POST" use:enhance>
        <div class="flex gap-2">
          <button type="submit" formaction="?/reload-random-background-image" class="icon-button">
            <Fa icon={faRotate} />
            Shuffle
          </button>
        </div>
      </form>
      {#if data.background?.image?.url}
        <a href={data.background.image.url} target="_blank" rel="noopener noreferrer" class="icon-button">
          <Fa icon={faDownload} />
          Download
        </a>
      {/if}
    </div>
  {/if}

  <p class="heading">Your Backgrounds</p>
  {#each data.userConfig.backgrounds as config, idx}
    <BackgroundRule {config} {data} on:clone={() => cloneCfg(idx, config)} on:select={() => selectCfg(config)} on:delete={() => deleteCfg(idx)} />
  {/each}
</div>

<form method="POST" on:submit|preventDefault={handleSubmit} action="?/save" class="flex justify-end">
  <SaveButton />
</form>

<style lang="postcss">
  div .heading {
    @apply text-lg font-semibold text-gray-900 dark:text-gray-300;
  }

  div .icon-button {
    @apply flex justify-center gap-1 p-3;
    @apply mr-2 inline-flex items-center rounded-lg bg-blue-700/80 p-1 text-center text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-600/80 dark:hover:bg-blue-700;
  }
</style>
