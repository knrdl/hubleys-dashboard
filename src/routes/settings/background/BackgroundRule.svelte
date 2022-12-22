<script lang="ts">
    import Fa from "svelte-fa";
    import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";

    export let data
    export let rule: BackgroundRule

    const CriteriaKeys: { label: string, value: BackgroundRuleCriterion['condition'] }[] = [
        {label: 'Weather', value: 'weather'},
        {label: 'Temperature', value: 'temperature'}
    ]

    function fmtHour(hour: number) {
        return new Date(0, 0, 0, hour, 0).toLocaleTimeString(data.userLang, {
            hour: '2-digit', minute: '2-digit'
        })
    }

    function fmtHourFromTo(hourFrom: number, hourTo: number) {
        return `${fmtHour(hourFrom)} - ${fmtHour(hourTo)}`
    }

    const HourSelectionRanges = [
        [0, 6], [6, 12], [12, 18], [18, 24]
    ].map(([h1, h2]) => ({title: fmtHourFromTo(h1, h2), value: [h1, h2]}))

    const RandomImageChangeDurations = [
        {title: 'Never', value: 0},
        {title: '10m', value: 10 * 60},
        {title: '30m', value: 30 * 60},
        {title: '1h', value: 60 * 60},
        {title: '6h', value: 6 * 60 * 60},
        {title: '12h', value: 12 * 60 * 60},
        {title: '24h', value: 24 * 60 * 60},
    ]

    const Weekdays = [0, 1, 2, 3, 4, 5, 6].map(i => ({
        title: new Date(0, 0, i + 1).toLocaleDateString(data.userLang, {"weekday": "long"}),
        value: i
    }))

    function addCondition() {
        rule.when.push({condition: null, values: []})
        rule.when = rule.when
    }
</script>

<div class="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 divide-y divide-dashed divide-slate-600 my-3">
    <div class="mb-3 font-normal text-gray-700 dark:text-gray-400 px-3 py-1">
        <span class="font-bold mb-3">
            {#if rule.when.length === 0}
                Always
            {:else}
                When
            {/if}
        </span>
        {#each rule.when as criterion}
            <div class="mb-2">
                {criterion.values}
                <label>
                    if
                    <select bind:value={criterion.condition}>
                        {#each CriteriaKeys as {label, value}}
                            <option {value}>{label}</option>
                        {/each}
                    </select>
                    is
                </label>
                {#each criterion.values as critVal}
                    {critVal}
                {/each}
                <!--{#if criterion.condition === 'hour'}-->
                <!--    <select bind:value={rule.when.hour_gt}>-->
                <!--        {#each HourSelectionRanges as range}-->
                <!--            <option value={range.value}>{range.text}</option>-->
                <!--        {/each}-->
                <!--    </select>-->
                <!--{/if}-->
            </div>
        {/each}
        <button on:click={addCondition} class="flex items-center gap-1">
            <Fa icon={faPlusCircle}/>
            condition
        </button>
        <!--        <select bind:value={rule.when.hour_gt}>-->
        <!--            {#each HourSelectionRanges as range}-->
        <!--                <option value={range.value}>{range.text}</option>-->
        <!--            {/each}-->
        <!--        </select>-->
    </div>
    <div class="mb-3 font-normal text-gray-700 dark:text-gray-400 px-3 py-1">
        <span class="font-bold mb-3">Show</span>

        <div class="mb-2">
            <label>
                • Background:
                <select bind:value={rule.show.background}>
                    <option value="triangles">Triangles</option>
                    <option value="static">Static Image</option>
                    <option value="random">Random Image</option>
                </select>
            </label>
            {#if rule.show.background === 'static'}
                <label>
                    <span>from</span>
                    <select bind:value={rule.show.static_image.format}>
                        <option value="id">Upload</option>
                        <option value="url">URL</option>
                    </select>
                </label>
            {/if}
            {#if rule.show.background === 'random'}
                <label>
                    <span>from</span>
                    <select bind:value={rule.show.random_image.provider}>
                        <option value="unsplash">Unsplash photo library</option>
                        <option value="reddit">Reddit posts</option>
                    </select>
                </label>
            {/if}
        </div>
        <div class="ml-5 mb-4">
            {#if rule.show.background === 'random'}
                {#if rule.show.random_image.provider === 'unsplash'}
                    <label>
                        Query:
                        <input type="text" placeholder="e.g. beach"
                               bind:value={rule.show.random_image.unsplash_query}/>
                    </label>
                {:else if rule.show.random_image.provider === 'reddit'}
                    <label>
                        Subreddits:
                        <input type="text" placeholder="e.g. wallpaper,wallpapers"
                               bind:value={rule.show.random_image.subreddits}/>
                    </label>
                {/if}
                <label>
                    Change after:
                    <select bind:value={rule.show.random_image.duration}>
                        {#each RandomImageChangeDurations as duration}
                            <option value={duration.value}>{duration.title}</option>
                        {/each}
                    </select>
                </label>
            {:else if rule.show.background === 'static'}
                {#if rule.show.static_image.format === 'id'}
                    <label>
                        Select:
                        <input type="file"/>
                    </label>
                {/if}
                {#if rule.show.static_image.format === 'url'}
                    <label>
                        <input type="url" placeholder="please enter image url"/>
                    </label>
                {/if}
            {/if}
        </div>

        • Filters:
        <label class="text-sm text-gray-900 dark:text-gray-300">
            <input checked={rule.show.blur !== false}
                   on:change={e => rule.show.blur = e.target.checked ? 'dark' : false}
                   type="checkbox" value="">
            {#if rule.show.blur === false}
                Blur
            {:else}
                Blur:
                {#if rule.show.blur}
                    <select bind:value={rule.show.blur}>
                        <option value="dark">dark</option>
                        <option value="light">light</option>
                    </select>
                {/if}
            {/if}
        </label>
        <label class="ml-2 text-sm text-gray-900 dark:text-gray-300">
            <input bind:checked={rule.show.dots} type="checkbox" value="">
            Dot Matrix
        </label>
        <label class="text-sm text-gray-900 dark:text-gray-300">
            <input checked={rule.show.particles !== false}
                   on:change={e => rule.show.particles = e.target.checked ? data.particleList[0] : false}
                   type="checkbox" value="">
            {#if rule.show.particles && data?.particleList}
                Particles:
                <select bind:value={rule.show.particles}>
                    {#each data.particleList as particle}
                        <option value={particle}>{particle}</option>
                    {/each}
                </select>
            {:else }
                Particles
            {/if}
        </label>
    </div>
</div>


<style>
    /*label required, otherwise colliding with global rules?*/
    label input[type=text], label input[type=url], label input[type=file], label select {
        @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white;
    }
</style>
