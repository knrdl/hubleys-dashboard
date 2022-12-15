<script lang="ts">
    import {page} from '$app/stores';
    import Fa from 'svelte-fa'
    import {faImage, faCloud, faKey, faUserGear} from '@fortawesome/free-solid-svg-icons'
    import Home from "$lib/widgets/Home.svelte";

    export let data
</script>

<svelte:head>
    <title>Settings</title>
</svelte:head>

<div class="border-b border-gray-200 dark:border-gray-700 p-6 pt-2 my-3 max-w-3xl bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md z-10">
    <nav class="mb-6">
        <ul class="flex flex-wrap items-center justify-center text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li class="mx-1">
                <a href="./widgets"
                   class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
                   aria-current={$page.url.pathname.endsWith('widgets') ? 'page' : undefined}>
                    <Fa icon={faUserGear} size="lg"/>
                    <span>Widgets</span>
                </a>
            </li>
            <li class="mx-1">
                <a href="./background"
                   class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
                   aria-current={$page.url.pathname.endsWith('background') ? 'page' : undefined}>
                    <Fa icon={faImage} size="lg"/>
                    <span>Background</span>
                </a>
            </li>
            <li class="mx-1">
                <a href="./weather"
                   class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
                   aria-current={$page.url.pathname.endsWith('weather') ? 'page' : undefined}>
                    <Fa icon={faCloud} size="lg"/>
                    <span>Weather</span>
                </a>
            </li>
            {#if data.isAdmin}
                <li class="mx-1">
                    <a href="./admin"
                       class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
                       aria-current={$page.url.pathname.endsWith('admin') ? 'page' : undefined}>
                        <Fa icon={faKey} size="lg"/>
                        <span>Admin</span>
                    </a>
                </li>
            {/if}
        </ul>
    </nav>
    <slot/>
</div>

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
