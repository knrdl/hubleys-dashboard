<script lang="ts">
    import Fa from "svelte-fa"
    import {faClone, faSquare, faSquareCheck, faTrashCan} from "@fortawesome/free-solid-svg-icons"
    import {createEventDispatcher} from "svelte"
    import {fade} from 'svelte/transition';

    const dispatch = createEventDispatcher()

    export let data
    export let config: BackgroundConfig

    const RandomImageChangeDurations = [
        {title: 'Never', value: 0},
        {title: '10m', value: 10 * 60},
        {title: '30m', value: 30 * 60},
        {title: '1h', value: 60 * 60},
        {title: '6h', value: 6 * 60 * 60},
        {title: '12h', value: 12 * 60 * 60},
        {title: '24h', value: 24 * 60 * 60},
    ]
</script>

<div class="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 divide-x divide-dashed divide-slate-600 my-3 flex"
     transition:fade>
    {#if data.userConfig.backgrounds.length > 1}
        <div class="flex flex-col justify-center gap-2 p-1">
            {#if config.selected}
                <button disabled class="icon-button">
                    <Fa icon={faSquareCheck}/>
                    <span>Select</span>
                </button>
            {:else}
                <button on:click={()=>dispatch('select')} class="icon-button">
                    <Fa icon={faSquare}/>
                    <span>Select</span>
                </button>
            {/if}
        </div>
    {/if}
    <div class="font-normal text-gray-700 dark:text-gray-400 px-3 py-4 grow">
        <div class="mb-2">
            <label>
                • Background:
                <select bind:value={config.background}>
                    <option value="triangles">Triangles</option>
                    <option value="static">Static Image</option>
                    <option value="random">Random Image</option>
                </select>
            </label>
            {#if config.background === 'static'}
                <label>
                    <span>from</span>
                    <select bind:value={config.static_image.source}>
                        <!--                        <option value="upload">Upload</option> TODO-->
                        <option value="web">Web</option>
                    </select>
                </label>
            {/if}
            {#if config.background === 'random'}
                <label>
                    <span>from</span>
                    <select bind:value={config.random_image.provider}>
                        <option value="unsplash">Unsplash photo library</option>
                        <option value="reddit">Reddit posts</option>
                    </select>
                </label>
            {/if}
        </div>
        <div class="ml-5 mb-4">
            {#if config.background === 'random'}
                {#if config.random_image.provider === 'unsplash'}
                    <label>
                        Query:
                        <input type="text" placeholder="e.g. beach"
                               bind:value={config.random_image.unsplash_query}/>
                    </label>
                {:else if config.random_image.provider === 'reddit'}
                    <label>
                        Subreddits:
                        <input type="text" placeholder="e.g. wallpaper,wallpapers"
                               bind:value={config.random_image.subreddits}/>
                    </label>
                {/if}
                <label>
                    Change after:
                    <select bind:value={config.random_image.duration}>
                        {#each RandomImageChangeDurations as duration}
                            <option value={duration.value}>{duration.title}</option>
                        {/each}
                    </select>
                </label>
            {:else if config.background === 'static'}
                {#if config.static_image.source === 'upload'}
                    <label>
                        <input type="file"/>
                    </label>
                {/if}
                {#if config.static_image.source === 'web'}
                    <label>
                        <input type="url" placeholder="please enter image url"/>
                    </label>
                {/if}
            {/if}
        </div>

        • Filters:
        <label class="text-sm text-gray-900 dark:text-gray-300">
            <input checked={config.blur !== false}
                   on:change={e => config.blur = e.target.checked ? 'dark' : false}
                   type="checkbox" value="">
            {#if config.blur === false}
                Blur
            {:else}
                Blur:
                {#if config.blur}
                    <select bind:value={config.blur}>
                        <option value="dark">dark</option>
                        <option value="light">light</option>
                    </select>
                {/if}
            {/if}
        </label>
        <label class="ml-2 text-sm text-gray-900 dark:text-gray-300">
            <input bind:checked={config.dots} type="checkbox" value="">
            Dot Matrix
        </label>
        <label class="text-sm text-gray-900 dark:text-gray-300">
            <input checked={config.particles !== false}
                   on:change={e => config.particles = e.target.checked ? data.particleList[0] : false}
                   type="checkbox" value="">
            {#if config.particles && data?.particleList}
                Particles:
                <select bind:value={config.particles}>
                    {#each data.particleList as particle}
                        <option value={particle}>{particle}</option>
                    {/each}
                </select>
            {:else }
                Particles
            {/if}
        </label>
    </div>
    <div class="flex flex-col justify-center gap-2 p-1">
        <button on:click={()=>dispatch('clone')} class="icon-button">
            <Fa icon={faClone}/>
            <span>Copy</span>
        </button>
        {#if data.userConfig.backgrounds.length > 1}
            <button on:click={()=>dispatch('delete')} class="icon-button">
                <Fa icon={faTrashCan}/>
                <span>Delete</span>
            </button>
        {/if}
    </div>
</div>


<style>
    /*label required, otherwise colliding with global rules?*/
    label input[type=text], label input[type=url], label input[type=file], label select {
        @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white;
    }

    div .icon-button {
        @apply flex flex-col justify-center gap-1 w-full;
        @apply text-white bg-blue-700/80 hover:bg-blue-800 font-medium rounded-lg text-sm p-1 text-center inline-flex items-center mr-2 dark:bg-blue-600/80 dark:hover:bg-blue-700;
    }

    div .icon-button[disabled] {
        @apply bg-gray-700 hover:bg-gray-700;
    }
</style>
