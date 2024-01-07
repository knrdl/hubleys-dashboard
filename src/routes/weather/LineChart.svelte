<script lang="ts">
  export let timestamps: number[]
  export let userLang: string
  export let selectedIdx: number | null
  export let unit: string = ''

  export let source1: { legend: string; data: number[] }
  export let source2: { legend: string; data: number[] } | null = null

  function isNewDay(oldTimestamp: number, newTimestamp: number) {
    if (!oldTimestamp || !newTimestamp) return false
    const oldTs = new Date(oldTimestamp * 1000)
    const newTs = new Date(newTimestamp * 1000)
    return oldTs.getDay() !== newTs.getDay()
  }

  $: valMin = Math.min(...source1.data, ...(source2?.data || []))
  $: valMax = Math.max(...source1.data, ...(source2?.data || []))
  $: entryW = diaW / timestamps.length

  const diaW = 500
  const diaH = 100
  const padL = 40
  const padB = 60
</script>

<svg viewBox="0 0 {diaW + padL} {diaH + padB}" {...$$restProps}>
  <g fill="currentColor" class="text-gray-800/80 dark:text-gray-300/80">
    {#each timestamps as ts, idx}
      {#if isNewDay(ts, timestamps[idx - 1])}
        <text x={padL + idx * entryW} y={diaH + 20}>
          {new Date(ts * 1000).toLocaleString(userLang, { day: '2-digit' })}
        </text>
      {/if}
    {/each}

    {#if selectedIdx !== null}
      <rect x={padL + selectedIdx * entryW} y="0" width={entryW} height={diaH} opacity="0.5"></rect>
    {/if}

    {#each [1, Math.floor(diaH / 2), diaH - 1] as y}
      <line x1={padL} y1={y} x2={diaW + padL} y2={y} stroke-dasharray="10" stroke-width="1" stroke-linecap="butt" opacity="0.9" stroke="currentColor"></line>
    {/each}

    <text x={padL - 3} y="0" dominant-baseline="hanging" text-anchor="end">{valMax}{unit}</text>
    <text x={padL - 3} y={diaH / 2} dominant-baseline="middle" text-anchor="end">{valMin + Math.round((valMax - valMin) / 2)}{unit}</text>
    <text x={padL - 3} y={diaH} text-anchor="end">{valMin}{unit}</text>
  </g>

  <text x={0} y={diaH + 30} dominant-baseline="hanging" fill="#44f">{source1.legend}</text>
  {#if source2}
    <text x={diaW + padL} y={diaH + 30} dominant-baseline="hanging" text-anchor="end" fill="#f44">{source2.legend}</text>
  {/if}

  <polyline
    stroke-width="2"
    stroke="#66f"
    fill="none"
    stroke-linecap="round"
    points={source1.data.map((e, idx) => `${padL + idx * entryW},${diaH - ((e - valMin) * diaH) / (valMax - valMin)}`).join(' ')}
  ></polyline>
  {#if source2}
    <polyline
      stroke-width="2"
      stroke="#f66"
      fill="none"
      stroke-linecap="round"
      points={source2.data.map((e, idx) => `${padL + idx * entryW},${diaH - ((e - valMin) * diaH) / (valMax - valMin)}`).join(' ')}
    ></polyline>
  {/if}
</svg>
