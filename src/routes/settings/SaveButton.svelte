<script>
  import Fa from 'svelte-fa'
  import { faSave } from '@fortawesome/free-solid-svg-icons'
</script>

<button
  type="submit"
  class="flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700"
>
  <Fa icon={faSave} />
  Save
</button>
