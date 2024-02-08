<script lang="ts">
  export let mode: 'center' | 'wide' | 'top' | 'bottom' | 'split'
  export let active: boolean = false
</script>

{#if mode === 'center' || mode === 'wide'}
  <div class="flex h-14 w-48 items-center justify-center gap-2 rounded-sm {active ? 'bg-slate-700 dark:bg-slate-500' : 'bg-slate-500 dark:bg-slate-700'}">
    <div class="m-2 flex flex-wrap items-center justify-center gap-2" class:w-24={mode === 'center'}>
      <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
      {#each [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as _}
        <div class="h-2.5 w-2.5 rounded-sm bg-white shadow-inner"></div>
      {/each}
    </div>
  </div>
{:else}
  <div
    class="flex h-28 w-28 flex-col items-center gap-2 rounded-sm {active ? 'bg-slate-700 dark:bg-slate-500' : 'bg-slate-500 dark:bg-slate-700'}"
    class:justify-end={mode === 'bottom' || mode === 'split'}
    class:justify-start={mode === 'top'}
  >
    {#if mode === 'split'}
      <div class="mt-4 h-4 w-8 rounded border-2 border-slate-600 shadow-inner"></div>
      <div class="w-full border border-slate-600 my-3" />
    {/if}
    <div class="mx-2 mb-4 flex w-20 flex-wrap items-center justify-center gap-2" class:mt-6={mode === 'top'}>
      <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
      {#each [0, 0, 0, 0, 0, 0, 0, 0] as _}
        <div class="h-2.5 w-2.5 rounded-sm bg-white shadow-inner"></div>
      {/each}
    </div>
  </div>
{/if}
