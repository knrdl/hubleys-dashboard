<script lang="ts">
    import {onMount} from "svelte";

    onMount(() => {
        setInterval(updateDisplayTime, 1000)
        updateDisplayTime() // todo: init serverside?
    })

    let displayTime: string = ""
    let tooltipTime: string = ""

    export let userLang

    function updateDisplayTime() {
        displayTime = new Date().toLocaleDateString(userLang, {
            weekday: 'short',
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
        tooltipTime = new Date().toLocaleDateString(userLang, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }
</script>

<span title={tooltipTime} style="font-variant-caps: petite-caps">{displayTime}</span>
