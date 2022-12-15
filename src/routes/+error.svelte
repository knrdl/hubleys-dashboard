<script>
    import {page} from '$app/stores';
    import Fa from "svelte-fa";
    import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
</script>

<div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 z-10">
    <div class="flex justify-center text-red-800">
        <Fa icon={faTriangleExclamation} size="4x"/>
    </div>
    <p class="font-normal text-gray-700 dark:text-gray-400">{$page.error.message}</p>
</div>
