<script lang="ts">
    import ClockFace from "../ClockFace.svelte";
    import {formatTime} from "../utils.js";
    import NumberInput from "./NumberInput.svelte";

    import Fa from "svelte-fa";
    import {faPlay, faPause, faStop} from '@fortawesome/free-solid-svg-icons'
    import {onDestroy, onMount} from "svelte";


    let remaining: number | null = null
    let total: number | null = null
    let intervalHandler = null
    let hh = 0, mm = 0, ss = 0
    let isPaused: boolean = false
    $: fraction = (remaining || 0) / total
    $: isRunning = !!intervalHandler
    $: value = (hh * 60 * 60 + mm * 60 + ss) * 1000

    onMount(() => {
        const lastValue = localStorage.getItem('hubleys:clock:timer-value')
        if (lastValue) [hh, mm, ss] = JSON.parse(lastValue)
    })

    function startTimer() {
        localStorage.setItem('hubleys:clock:timer-value', JSON.stringify([hh, mm, ss]))
        total = remaining = value
        intervalHandler = setInterval(() => {
            if (!isPaused)
                remaining -= 100
            if (remaining < 100) {
                startAlarm()
                clearInterval(intervalHandler)
                intervalHandler = null
            }
        }, 100)
    }

    function pauseTimer() {
        isPaused = !isPaused
    }

    function stopTimer() {
        clearInterval(intervalHandler)
        intervalHandler = null
        stopAlarm()
    }

    let audio: HTMLAudioElement

    let isAlarmOn: boolean = false

    function startAlarm() {
        audio.volume = .5
        audio.play()
        isAlarmOn = true
    }

    function stopAlarm() {
        isAlarmOn = false
    }

    onDestroy(() => clearInterval(intervalHandler))
</script>

<audio bind:this={audio} on:ended={()=>setTimeout(()=>isAlarmOn ? audio.play():null, 250)}
       src="data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEA0AAABAAgAZGF0YU{Array(1000).join('123')}">
</audio>

<div class:blink={!isRunning && isAlarmOn}>
    <ClockFace text={formatTime(remaining)} {isRunning} {fraction} mode="countdown"/>
</div>

{#if isRunning || isAlarmOn}
    <div class="flex justify-center items-center text-slate-800 dark:text-slate-100">
        {#if !isAlarmOn}
            <button type="button" on:click={pauseTimer} class="
                    border-amber-300 rounded-lg border enabled:hover:bg-amber-400 dark:border-amber-500 dark:enabled:hover:bg-amber-600
                    mx-4 px-5 py-2.5
                ">
                {#if isPaused}
                    <Fa icon={faPlay}/>
                {:else}
                    <Fa icon={faPause}/>
                {/if}
            </button>
        {/if}
        <button type="button" on:click={stopTimer} class="
        border-red-400 rounded-md border enabled:hover:bg-red-500 dark:border-rose-500 dark:enabled:hover:bg-rose-600
        mx-4 px-5 py-2.5
    ">
            <Fa icon={faStop}/>
        </button>
    </div>
{:else}
    <div class="flex justify-center items-center text-slate-800 dark:text-slate-100">
        <NumberInput bind:value={hh}/>
        <div class="px-2 font-bold text-lg">:</div>
        <NumberInput bind:value={mm} on:overflow={()=>hh++}/>
        <div class="px-2 font-bold text-lg">:</div>
        <NumberInput bind:value={ss} on:overflow={()=>mm++}/>
        <button type="button" on:click={startTimer} disabled={value<1} class="
        enabled:border-emerald-300 rounded-lg border enabled:hover:bg-emerald-400 dark:enabled:border-emerald-500 dark:enabled:hover:bg-emerald-600 disabled:bg-slate-300
        ml-4 px-5 py-2.5
    ">
            <Fa icon={faPlay}/>
        </button>
    </div>
{/if}

<style>
    .blink {
        animation: blink .75s step-start infinite;
    }

    @keyframes blink {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>
