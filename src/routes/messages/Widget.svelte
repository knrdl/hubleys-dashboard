<script lang="ts">
  import Fa from 'svelte-fa'
  import { faXmark } from '@fortawesome/free-solid-svg-icons'
  import './messages.css'
  import { slide } from 'svelte/transition'
  import type { Message } from '$lib/server/sysconfig/types'
  import { t } from '$lib/translations'

  export let messages: Message[]

  let hiddenMsgs: string[] = []
</script>

{#each messages as msg}
  {#if !hiddenMsgs.includes(msg.html)}
    <article
      class="
  message
  relative
  rounded-md border border-gray-300 bg-gray-100/70 p-2
  font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-700/80 dark:text-white"
      out:slide
    >
      <button
        type="button"
        on:click={() => (hiddenMsgs = [...hiddenMsgs, msg.html])}
        title={$t('common.close')}
        class="absolute -right-2 -top-2 flex w-4 items-center justify-center rounded-full bg-gray-800 hover:scale-125 hover:bg-red-800"
      >
        <Fa icon={faXmark} class="text-white" />
      </button>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html msg.html}
    </article>
  {/if}
{/each}
