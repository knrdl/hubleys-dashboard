<script>
  import Fa from 'svelte-fa'
  import { faSave } from '@fortawesome/free-solid-svg-icons'
  import { t } from '$lib/translations'
</script>

<button
  type="submit"
  class="flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600"
>
  <Fa icon={faSave} />
  {$t('common.save')}
</button>
