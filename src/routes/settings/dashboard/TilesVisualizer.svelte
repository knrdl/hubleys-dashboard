<script lang="ts">
  export let mode: 'center' | 'wide' | 'top' | 'bottom'
  export let active: boolean = false
</script>

{#if mode === 'center' || mode === 'wide'}
  <div class="flex h-14 w-48 items-center justify-center gap-2 rounded-sm {active ? 'bg-slate-700 dark:bg-slate-500' : 'bg-slate-500 dark:bg-slate-700'}">
    <div class="m-2 flex flex-wrap items-center justify-center gap-2" class:w-24={mode === 'center'}>
      {#each [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as _}
        <div class="h-2.5 w-2.5 rounded-sm bg-white shadow-inner"></div>
      {/each}
    </div>
  </div>
{:else}
  <div
    class="flex h-28 w-28 justify-center gap-2 rounded-sm {active ? 'bg-slate-700 dark:bg-slate-500' : 'bg-slate-500 dark:bg-slate-700'}"
    class:items-end={mode === 'bottom'}
    class:items-start={mode === 'top'}
  >
    <div class="m-2 mb-4 mt-6 flex w-20 flex-wrap items-center justify-center gap-2">
      {#each [0, 0, 0, 0, 0, 0, 0, 0] as _}
        <div class="h-2.5 w-2.5 rounded-sm bg-white shadow-inner"></div>
      {/each}
    </div>
  </div>
{/if}
