<script lang="ts">
    import Fa from "svelte-fa";
    import {faCog, faHouse} from "@fortawesome/free-solid-svg-icons";
    import {page} from '$app/stores';
</script>

{#if $page.url.pathname !== '/' }
    <div class="fixed left-6 bottom-6 group z-50">
        <a href="/"
           class="
        flex justify-center items-center
        w-12 h-12 text-white
        rounded-full
        bg-blue-700 hover:bg-blue-800 hover:scale-110
        dark:bg-blue-600 dark:hover:bg-blue-700">
            <Fa icon={faHouse} size="md"/>
        </a>
    </div>
{/if}

<!--todo-->
<footer class="flex justify-between w-screen absolute bottom-0 items-start">
    <div></div>
    {#if !$page.url.pathname.startsWith('/settings/') }
        <a href="/settings/widgets"
           class="pl-3 pt-1 pr-2 pb-1 select-none bg-slate-900/80 hover:text-blue-400 text-slate-100 rounded-tl-md">
            <Fa icon={faCog}/>
        </a>
    {/if}
</footer>
