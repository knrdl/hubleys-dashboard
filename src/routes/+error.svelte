<script>
  import { page } from '$app/stores'
  import Fa from 'svelte-fa'
  import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
</script>

<div class="z-10 max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
  <div class="flex justify-center text-red-800">
    <Fa icon={faTriangleExclamation} size="4x" />
  </div>
  <p class="font-normal text-gray-700 dark:text-gray-400">{$page.error?.message}</p>
</div>
