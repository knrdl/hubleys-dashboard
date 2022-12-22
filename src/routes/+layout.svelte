<script lang="ts">
    import "../app.css";
    import Particles from "svelte-particles";
    import Header from "./Header.svelte";
    import {onMount} from "svelte";

    export let data

    // const STORAGE_KEY = 'hubleys-background'

    // async function loadNewBackgroundConfig() {
    //     const now = new Date()
    //     const params = new URLSearchParams()
    //     params.set('weekday', now.getDay().toString())
    //     params.set('hour', now.getHours().toString())
    //     if (data.background.image) {
    //         params.set('bgImgUrl', data.background.image.url)
    //         params.set('bgImgExpiresAt', now.getHours().toString())
    //     }
    //     const res = await fetch('/background?' + params.toString())
    //     if (res.ok) {
    //         data.background = await res.json()
    //         localStorage.setItem(STORAGE_KEY, JSON.stringify(data.background)) // cache new config for restore on reload
    //     }
    // }

    let particlesInit = async (main) => {
        const loadFull = (await import('tsparticles')).loadFull
        await loadFull(main);
    }

    function handleTheme() {
        if (data.userConfig.theme === 'dark' || (data.userConfig.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            window.document.documentElement.classList.add('dark')
        } else {
            window.document.documentElement.classList.remove('dark')
        }
    }

    onMount(() => {
        // console.log('onmount')
        // if (data.background === null) {  // restore last background config from local cache
        //     const val = localStorage.getItem(STORAGE_KEY)
        //     if (val) data.background = JSON.parse(val)
        // }
        // console.log(data.userConfig.background_rules)
    })

    let triangleCanvas: HTMLCanvasElement
    let trianglify
    $: { // this could be handled in onMount but then config changes would not be applied as live reload
        if (typeof window !== "undefined") {
            // if (data.background === null) {  // restore last background config from local cache
            //     const val = localStorage.getItem(STORAGE_KEY)
            //     if (val) data.background = JSON.parse(val)
            //     loadNewBackgroundConfig()
            // }

            if (data.background?.triangles) {
                (async () => {
                    if (!trianglify)
                        trianglify = (await import('@victorioberra/trianglify-browser/dist/trianglify.bundle')).default
                    const pattern = trianglify({width: window.innerWidth, height: window.innerHeight})
                    pattern.toCanvas(triangleCanvas)
                })()
            }

            handleTheme()
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => handleTheme())
        }

        if (typeof window !== "undefined") {
            handleTheme()
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => handleTheme())
        }
    }
</script>

<div class="
min-h-screen z-[-100] absolute
flex flex-col items-center
bg-gradient-to-b
from-slate-200 via-blue-100 to-sky-100
dark:from-gray-700 dark:via-zinc-700 dark:to-stone-700
">
    {#if data.background?.image?.url}
        <div class="fixed top-0 left-0 right-0 bottom-0 z-[-90]"
        >
            <div style='background-image: url("{data.background.image.url}")'
                 class="sliding-background w-full h-full bg-cover bg-center bg-fixed"></div>
        </div>
    {/if}
    {#if data.background?.triangles}
        <canvas class="fixed top-0 left-0 right-0 bottom-0 z-[-80] w-screen h-screen"
                bind:this={triangleCanvas}></canvas>
    {/if}
    {#if data.background?.blur === 'dark'}
        <div class="fixed top-0 left-0 right-0 bottom-0 z-[-70]"
             style="background: linear-gradient(to right, rgba(5, 8, 101, 0.8), rgba(0, 24, 49, 0))"></div>
    {:else if data.background?.blur === 'light'}
        <div class="fixed top-0 left-0 right-0 bottom-0 z-[-70]"
             style="background: linear-gradient(to right, rgba(245, 235, 235, 0.6), rgba(255, 24, 49, 0))"></div>
    {/if}
    {#if data.background?.dots}
        <div class="fixed top-0 left-0 right-0 bottom-0 z-[-60] opacity-20"
             style="background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4IiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2IDY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPi5zdDB7ZmlsbDojRkZGRkZGO308L3N0eWxlPjxyZWN0IGNsYXNzPSJzdDAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4K') repeat;">
        </div>
    {/if}
    {#if data.background?.particles}
        <Particles particlesInit={particlesInit}
                   options={{pauseOnBlur: true,fpsLimit:30, ...data.background.particles}}/>
    {/if}
    <Header {data}/>
    <slot/>
</div>


