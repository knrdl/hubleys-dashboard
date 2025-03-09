<script lang="ts">
  export let checked: boolean
</script>

<label class="relative my-1 inline-flex cursor-pointer items-center">
  <input type="checkbox" class="peer sr-only" bind:checked />
  <div
    class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-hidden after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
  ></div>
  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
    <slot />
  </span>
</label>
