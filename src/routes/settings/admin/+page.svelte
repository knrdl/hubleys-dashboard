<script lang="ts">
  import { enhance } from '$app/forms'
  import Message from '../Message.svelte'

  export let form
  export let data
</script>

<form method="POST" use:enhance>
  <Message text={form?.message} kind="success" />
  <div class="flex gap-2">
    <button type="submit" formaction="?/reload-system-config">Reload System Config</button>
    <button type="submit" formaction="?/reload-users-config">Reload Users Config</button>
    <button type="submit" formaction="?/clear-http-cache">Clear HTTP Cache</button>
  </div>
</form>

<div class="mt-5 rounded border border-gray-200 p-5 font-light dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
  <h1 class="text-lg font-bold">Current User Info:</h1>
  <ul>
    <li>UserID: {data.userinfo?.userid}</li>
    <li>Username: {data.userinfo?.username}</li>
    <li>Email: {data.userinfo?.email}</li>
    <li>Groups: {data.userinfo?.groups?.sort().join(', ')}</li>
    <li>Is admin: {data.userinfo?.isAdmin}</li>
  </ul>
</div>

<style lang="postcss">
  form button {
    @apply grow rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700;
  }
</style>
