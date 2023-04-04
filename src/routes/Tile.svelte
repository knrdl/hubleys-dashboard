<script lang="ts">
	import Fa from 'svelte-fa'
	import {
		faEllipsisV,
		faCircleQuestion,
		faExpand,
		faFolderOpen,
		faPlus
	} from '@fortawesome/free-solid-svg-icons'
	import TileFolder from './TileFolder.svelte'

	export let title: Tile['title'];
	export let emoji: Tile['emoji'] = undefined;
	export let logo: Tile['logo'] = undefined;
	export let url: Tile['url'] = undefined;
	export let display: Tile['display'] = undefined;
	export let menu: Tile['menu'] = undefined;

	let selectedCoords: null | { x: number; y: number } = null;

	function onMoreClick(ev: MouseEvent) {
		selectedCoords = { x: ev.x, y: ev.y };
	}

	function onTileClick(ev: MouseEvent) {
		if (!url) {
			ev.preventDefault()
			ev.stopPropagation()
			selectedCoords = { x: ev.x, y: ev.y }
		}
	}
</script>

{#if selectedCoords}
	<TileFolder
		clickX={selectedCoords.x}
		clickY={selectedCoords.y}
		on:close={() => (selectedCoords = null)}
		{menu}
		folderTitle={title}
	/>
{/if}

<a
	href={url || '#'}
	target="_blank"
	rel="noopener noreferrer"
	class="card
group relative
flex flex-col justify-center
m-2 p-1 rounded-md shadow-md no-underline
bg-gradient-to-br from-gray-700/90 via-slate-600/90 to-zinc-700/90
hover:bg-gradient-to-tr hover:from-teal-600/90 hover:via-sky-700/90 hover:to-indigo-700/90
hover:scale-110 transition-transform ease-in-out
"
	on:click={onTileClick}
>
	{#if menu}
		{#if url}
			<button
				on:click|preventDefault|stopPropagation={onMoreClick}
				class="
                    absolute -top-1 -right-1 w-8 h-8
                    inline-flex justify-center items-center
                    text-xs text-slate-100 font-bold
                    rounded-lg
                    group-hover:scale-110 transition-transform ease-in-out group-hover:text-white
                    hover:bg-slate-900/80
                        "
			>
				<Fa icon={faEllipsisV} />
			</button>
		{:else}
			<div
				class="
                absolute -top-1 -right-1 w-8 h-8
                inline-flex justify-center items-center
                text-xs font-bold text-slate-400 group-hover:text-slate-200
            "
			>
				<Fa icon={faPlus} />
			</div>
		{/if}
	{/if}
	<div
		{title}
		class="flex justify-center items-center text-4xl h-12 text-stone-200 overflow-hidden"
	>
		{#if logo}
			<img src={logo} alt={emoji || title} class="max-w-full max-h-full" />
		{:else if emoji}
			<span>{emoji}</span>
		{:else if url}
			<Fa icon={faCircleQuestion} />
		{:else if menu?.some((itm, idx) => idx < 4 && (itm.logo || itm.emoji))}
			<div
				class="inline-grid gap-1 text-xl"
				class:grid-cols-2={menu.length > 1}
				class:grid-rows-2={menu.length > 2}
			>
				{#each menu as item, index}
					{#if index < 4}
						<div
							class:col-span-2={index === menu.length - 1 && index % 2 === 0}
							class="flex justify-center"
						>
							<div class="w-6 h-6 flex justify-center items-center">
								{#if item.logo}
									<img
										src={item.logo}
										alt={item.emoji || item.title}
										class="max-w-full max-h-full"
									/>
								{:else if item.emoji}
									<span>{item.emoji}</span>
								{:else}
									<Fa icon={faExpand} />
								{/if}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<Fa icon={faFolderOpen} />
		{/if}
	</div>
	{#if display !== 'icon-only' || (!logo && !emoji)}
		<span class="leading-5 overflow-hidden text-center text-slate-300 mt-1">{title}</span>
	{/if}
</a>

<style>
	.card {
		--height: 90px;
		--width: calc(var(--height) * 1.618);
		width: var(--width);
		height: var(--height);
	}
</style>
