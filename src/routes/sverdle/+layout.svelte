<script lang="ts">
    import {fly} from 'svelte/transition';
</script>

<div class="border-b border-gray-200 dark:border-gray-700 p-6 pb-2 my-3 max-w-3xl bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md z-10"
     in:fly={{y:-20}}>
    <slot/>
</div>

<style>
    :root {
        --font-body: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
        Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        --font-mono: 'Fira Mono', monospace;
        --color-bg-0: rgb(202, 216, 228);
        --color-bg-1: hsl(209, 36%, 86%);
        --color-bg-2: hsl(224, 44%, 95%);
        --color-theme-1: #ff3e00;
        --color-theme-2: #4075a6;
        --color-text: rgba(0, 0, 0, 0.7);
        --column-width: 42rem;
        --column-margin-top: 4rem;
        font-family: var(--font-body);
        color: var(--color-text);
    }
</style>
