<script lang="ts">
  import { fly } from 'svelte/transition'
</script>

<div class="z-10 my-3 max-w-3xl rounded-lg border-b border-gray-200 bg-slate-100 p-6 pb-2 shadow-md dark:border-gray-700 dark:bg-gray-800" in:fly={{ y: -20 }}>
  <slot />
</div>
