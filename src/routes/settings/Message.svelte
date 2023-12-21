<script lang="ts">
  import { fade, slide } from 'svelte/transition'
  import Fa from 'svelte-fa'
  import { faCheckCircle, faInfoCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'

  export let text: string | null | undefined = null
  export let kind: 'info' | 'success' | 'error' = 'info'
</script>

{#if text}
  <div
    class="mb-4 flex items-center gap-1 rounded-lg border p-4 text-sm dark:border-0"
    class:bg-blue-100={kind === 'info'}
    class:dark:bg-blue-200={kind === 'info'}
    class:text-blue-700={kind === 'info'}
    class:dark:text-blue-800={kind === 'info'}
    class:bg-green-100={kind === 'success'}
    class:dark:bg-green-200={kind === 'success'}
    class:text-green-700={kind === 'success'}
    class:dark:text-green-800={kind === 'success'}
    class:bg-red-100={kind === 'error'}
    class:dark:bg-red-200={kind === 'error'}
    class:text-red-700={kind === 'error'}
    class:dark:text-red-800={kind === 'error'}
    role="alert"
    in:slide
  >
    {#if kind === 'info'}
      <Fa icon={faInfoCircle} size="lg" />
    {:else if kind === 'success'}
      <Fa icon={faCheckCircle} size="lg" />
    {:else if kind === 'error'}
      <Fa icon={faXmarkCircle} size="lg" />
    {/if}

    {#key text}
      <div in:fade>
        {text}
      </div>
    {/key}
  </div>
{/if}
