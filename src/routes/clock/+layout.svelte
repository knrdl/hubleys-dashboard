<script lang="ts">
  import { page } from '$app/stores'
  import Fa from 'svelte-fa'
  import { faStopwatch20, faHourglass } from '@fortawesome/free-solid-svg-icons'
  import { fly } from 'svelte/transition'
</script>

<svelte:head>
  <title>Clock</title>
</svelte:head>

<nav class="z-10 max-w-xl rounded-lg border-b border-gray-200 bg-slate-100 p-6 pt-2 shadow-md dark:border-gray-700 dark:bg-gray-800" in:fly={{ y: -20 }}>
  <ul class="flex flex-wrap items-center justify-center text-center text-sm font-medium text-gray-500 dark:text-gray-400">
    <li class="mx-1">
      <a
        href="./stopwatch"
        class="group inline-flex rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
        aria-current={$page.url.pathname.endsWith('stopwatch') ? 'page' : undefined}
      >
        <Fa icon={faStopwatch20} size="lg" />
        <span>Stopwatch</span>
      </a>
    </li>
    <li class="mx-1">
      <a
        href="./timer"
        class="group inline-flex rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
        aria-current={$page.url.pathname.endsWith('timer') ? 'page' : undefined}
      >
        <Fa icon={faHourglass} size="lg" />
        Timer
      </a>
    </li>
  </ul>
  <slot />
</nav>

<style lang="postcss">
  ul li a[aria-current='page'] {
    @apply border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500;
  }

  ul li a[aria-current='page'] :global(svg) {
    @apply text-blue-600 dark:text-blue-500;
  }

  ul li a :global(svg) {
    @apply mr-2 h-5 w-5;
  }
</style>
