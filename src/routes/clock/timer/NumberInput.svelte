<script lang="ts">
    import Fa from "svelte-fa";
    import {faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons'
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher()

    export let value: number | null = null

    export let disabled

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

    let previousValue = null

    function validator(node: HTMLInputElement) {
        return {
            update(val) {
                value = (val === null || val < node.min || val > node.max) ? previousValue : parseInt(val)
                previousValue = value
            }
        }
    }
</script>

<div class="flex flex-col items-center">
    <button type="button" on:click={inc} {disabled} class="
            border border-gray-300 dark:border-gray-600 rounded-t w-full flex justify-center p-1
    ">
        <Fa icon={faChevronUp}/>
    </button>
    <input type="number" bind:value {disabled} use:validator={value}
           class="
            text-center w-10
            bg-gray-100 dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-400 text-lg
        " placeholder="0" min="0" max="60"/>
    <button type="button" on:click={dec} {disabled} class="
            border border-gray-300 dark:border-gray-600 rounded-b w-full flex justify-center p-1
    ">
        <Fa icon={faChevronDown}/>
    </button>
</div>
