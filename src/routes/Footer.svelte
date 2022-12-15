<script lang="ts">
    import Fa from "svelte-fa";
    import {faCog} from "@fortawesome/free-solid-svg-icons";
    import {page} from '$app/stores';
</script>

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
