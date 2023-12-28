<script lang="ts">
  import { onDestroy } from 'svelte'
  import { formatTime } from '../utils'
  import Fa from 'svelte-fa'
  import { faPlay, faStop, faCircleNotch, faPause } from '@fortawesome/free-solid-svg-icons'
  import { fly } from 'svelte/transition'
  import ClockFace from '../ClockFace.svelte'
  import { t } from '$lib/translations'

  let rounds: number[] = []

  let lapse: number | null = null

  let intervalHandler: number | null = null
  let isPaused: boolean = false

  function startStopwatch() {
    lapse = 0
    rounds = []
    isPaused = false
    intervalHandler = setInterval(() => {
      if (!isPaused && lapse !== null) lapse += 100
    }, 100) as unknown as number
  }

  function pauseStopwatch() {
    isPaused = !isPaused
  }

  function captureRound() {
    if (lapse !== null) {
      rounds.push(lapse)
      rounds = rounds
    }
  }

  function stopStopwatch() {
    if (intervalHandler !== null) clearInterval(intervalHandler)
    intervalHandler = null
    isPaused = false
  }

  onDestroy(() => {
    if (intervalHandler !== null) clearInterval(intervalHandler)
  })

  $: fraction = (((lapse || 0) / 1000) % 60) / 60
  $: isRunning = !!intervalHandler
</script>

<div class="flex flex-col items-center">
  <ClockFace text={formatTime(lapse || 0)} {isRunning} {fraction} mode="satellite" />

  <div class="inline-flex rounded-md shadow-sm" role="group">
    {#if !isRunning}
      <button
        type="button"
        on:click={startStopwatch}
        class="rounded-l-lg border bg-emerald-300 enabled:hover:bg-emerald-400 dark:bg-emerald-500 dark:enabled:hover:bg-emerald-600"
      >
        <Fa icon={faPlay} class="mr-2" />
        {#if lapse !== null}
          Restart
        {:else}
          Start
        {/if}
      </button>
    {:else}
      <button
        type="button"
        on:click={pauseStopwatch}
        class="rounded-l-lg border bg-amber-300 enabled:hover:bg-amber-400 dark:bg-amber-500 dark:enabled:hover:bg-amber-600"
      >
        <Fa icon={faPause} class="mr-2" />
        {#if isPaused}
          {$t('clock.continue')}
        {:else}
          {$t('clock.pause')}
        {/if}
      </button>
    {/if}
    <button
      type="button"
      on:click={captureRound}
      disabled={!isRunning || isPaused}
      class="border-b border-t bg-sky-300 enabled:hover:bg-sky-400 dark:bg-sky-500 dark:enabled:hover:bg-sky-600"
    >
      <Fa icon={faCircleNotch} class="mr-2" />
      {$t('clock.round')}
    </button>
    <button
      type="button"
      on:click={stopStopwatch}
      disabled={!isRunning}
      class="rounded-r-md border bg-red-400 enabled:hover:bg-red-500 dark:bg-rose-500 dark:enabled:hover:bg-rose-600"
    >
      <Fa icon={faStop} class="mr-2" />
      {$t('clock.stop')}
    </button>
  </div>
</div>

<div class="mt-3 overflow-x-auto">
  <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
    <tbody>
      {#each rounds as round, idx (round)}
        <tr
          class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
          in:fly={{ y: -20, duration: 300, delay: 50 }}
        >
          <th scope="row" class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
            {formatTime(round)}
          </th>
          <td class="px-6 py-4">
            {#if idx > 0}
              +{formatTime(round - rounds[idx - 1])}
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="postcss">
  div[role='group'] button {
    @apply inline-flex items-center border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 disabled:bg-gray-300 dark:border-gray-600 dark:text-slate-800 dark:enabled:hover:text-slate-100;
  }
</style>
