<script lang="ts">
    import Fa from 'svelte-fa'
    import {faHouse} from '@fortawesome/free-solid-svg-icons'
</script>

<!--todo: should be part of footer-->
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
