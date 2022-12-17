<script lang="ts">
    import {page} from '$app/stores';
    import Fa from 'svelte-fa'
    import {faStopwatch20, faHourglass, faHouse} from '@fortawesome/free-solid-svg-icons'
    import Home from "$lib/widgets/Home.svelte";
</script>

<svelte:head>
    <title>Clock</title>
</svelte:head>

<nav class="border-b border-gray-200 dark:border-gray-700 p-6 pt-2 max-w-xl bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md z-10">
    <ul class="flex flex-wrap items-center justify-center text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        <li class="mx-1">
            <a href="./stopwatch"
               class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
               aria-current={$page.url.pathname.endsWith('stopwatch') ? 'page' : undefined}>
                <Fa icon={faStopwatch20} size="lg"/>
                <span>Stopwatch</span>
            </a>
        </li>
        <li class="mx-1">
            <a href="./timer"
               class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
               aria-current={$page.url.pathname.endsWith('timer') ? 'page' : undefined}>
                <Fa icon={faHourglass} size="lg"/>
                Timer
            </a>
        </li>
    </ul>
    <slot/>
</nav>

<Home/>

<style>
    ul li a[aria-current='page'] {
        @apply border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500;
    }

    ul li a[aria-current='page'] :global svg {
        @apply text-blue-600 dark:text-blue-500;
    }

    ul li a :global svg {
        @apply mr-2 w-5 h-5;
    }
</style>
