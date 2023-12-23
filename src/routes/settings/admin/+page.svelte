<script lang="ts">
  import { enhance } from '$app/forms'
  import { faRotate } from '@fortawesome/free-solid-svg-icons'
  import Message from '../Message.svelte'
  import Fa from 'svelte-fa'

  export let form
  export let data
</script>

<form method="POST" action="?/reload" use:enhance>
  <Message text={form?.message} kind="success" />
  <button type="submit">
    <Fa icon={faRotate} size="lg" />
    Reload application</button
  >
  <ul class="ml-5 mt-1 list-inside list-disc text-gray-900 dark:text-gray-300">
    <li>Reloads system configuration in <span class="font-mono font-semibold">config.yml</span></li>
    <li>Reloads user configurations</li>
    <li>Clears HTTP caches</li>
  </ul>
</form>

<div class="mt-5 rounded border border-gray-200 p-5 font-light dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
  <header class="text-lg font-bold">Your authentication data</header>
  <section class="ml-5">
    <ul>
      <li>UserID: {data.userinfo?.userid}</li>
      <li>Username: {data.userinfo?.username}</li>
      <li>Email: {data.userinfo?.email}</li>
      <li>Groups: {data.userinfo?.groups?.sort().join(', ')}</li>
      <li>Is admin: {data.userinfo?.isAdmin}</li>
    </ul>
  </section>
  <header class="mt-5 text-lg font-bold">About the application</header>
  <section class="ml-5">
    <ul>
      <li>Version: {data.appinfo.version}</li>
      <li>Build Date: {data.appinfo.buildDate}</li>
    </ul>
  </section>
</div>

<style lang="postcss">
  form button {
    @apply flex grow gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium uppercase text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700;
  }
</style>
