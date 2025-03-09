<script lang="ts">
  import { page } from '$app/stores'
  import Fa from 'svelte-fa'
  import { faImage, faCloud, faKey, faSliders, faTable } from '@fortawesome/free-solid-svg-icons'
  import { fly } from 'svelte/transition'
  import { t } from '$lib/translations'
  import type { LayoutData } from './$types'

  export let data: LayoutData
</script>

<svelte:head>
  <title>{$t('common.settings')}</title>
</svelte:head>

<div
  class="z-10 my-3 w-screen rounded-lg border-b border-gray-200 bg-slate-100/95 p-6 pt-2 shadow-md md:max-w-3xl dark:border-gray-700 dark:bg-gray-800/95"
  in:fly={{ y: -20 }}
>
  <nav class="mb-6">
    <ul class="flex flex-wrap items-center justify-center text-center text-sm font-medium text-gray-500 dark:text-gray-400">
      <li class="mx-1">
        <a
          href="./background"
          class="group inline-flex rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
          aria-current={$page.url.pathname.endsWith('background') ? 'page' : undefined}
        >
          <Fa icon={faImage} size="lg" class="mr-2 w-5" />
          <span>{$t('settings.nav.background')}</span>
        </a>
      </li>
      <li class="mx-1">
        <a
          href="./dashboard"
          class="group inline-flex rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
          aria-current={$page.url.pathname.endsWith('dashboard') ? 'page' : undefined}
        >
          <Fa icon={faTable} size="lg" class="mr-2 w-5" />
          <span>{$t('settings.nav.dashboard')}</span>
        </a>
      </li>
      {#if data.isWeatherProviderConfigured}
        <li class="mx-1">
          <a
            href="./weather"
            class="group inline-flex rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            aria-current={$page.url.pathname.endsWith('weather') ? 'page' : undefined}
          >
            <Fa icon={faCloud} size="lg" class="mr-2 w-5" />
            <span>{$t('settings.nav.weather')}</span>
          </a>
        </li>
      {/if}
      <li class="mx-1">
        <a
          href="./system"
          class="group inline-flex rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
          aria-current={$page.url.pathname.endsWith('system') ? 'page' : undefined}
        >
          <Fa icon={faSliders} size="lg" class="mr-2 w-5" />
          <span>{$t('settings.nav.system')}</span>
        </a>
      </li>
      {#if data.isAdmin}
        <li class="mx-1">
          <a
            href="./admin"
            class="group inline-flex rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            aria-current={$page.url.pathname.endsWith('admin') ? 'page' : undefined}
          >
            <Fa icon={faKey} size="lg" class="mr-2 w-5" />
            <span>{$t('settings.nav.admin')}</span>
          </a>
        </li>
      {/if}
    </ul>
  </nav>
  <slot />
</div>

<style lang="postcss">
  @reference "tailwindcss";

  ul li a[aria-current='page'] {
    @apply border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500;
  }
</style>
