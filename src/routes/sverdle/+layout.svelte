<script lang="ts">
    import {fly} from 'svelte/transition';
</script>

<div class="border-b border-gray-200 dark:border-gray-700 p-6 pb-2 my-3 max-w-3xl bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md z-10"
     in:fly={{y:-20}}>
    <slot/>
</div>

