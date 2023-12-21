<script lang="ts">
  import Fa from 'svelte-fa'
  import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let value: number

  export let disabled: boolean = false

  function inc() {
    value++
    if (value === 60) {
      value = 0
      dispatch('overflow')
    }
  }

  function dec() {
    value--
    if (value < 0) {
      value = 0
      dispatch('underflow')
    }
  }

  let previousValue: number = 0

  function validator(node: HTMLInputElement) {
    return {
      update(val: string) {
        value = val === null || val < node.min || val > node.max ? previousValue : parseInt(val)
        previousValue = value
      }
    }
  }
</script>

<div class="flex flex-col items-center">
  <button
    type="button"
    on:click={inc}
    {disabled}
    class="
            flex w-full justify-center rounded-t border border-gray-300 p-1 dark:border-gray-600
    "
  >
    <Fa icon={faChevronUp} />
  </button>
  <input
    type="number"
    bind:value
    {disabled}
    use:validator
    class="
            w-10 rounded-none border
            border-gray-300 bg-gray-100
            text-center text-lg text-gray-900
            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400
        "
    placeholder="0"
    min="0"
    max="60"
  />
  <button
    type="button"
    on:click={dec}
    {disabled}
    class="
            flex w-full justify-center rounded-b border border-gray-300 p-1 dark:border-gray-600
    "
  >
    <Fa icon={faChevronDown} />
  </button>
</div>
