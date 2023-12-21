<script lang="ts">
  const circleRadius = 42
  export let isRunning: boolean = false
  export let text: string = ''
  export let fraction: number = 0 // percentage of circle in 0..1
  export let mode: 'countdown' | 'satellite'
</script>

<svg viewBox="0 0 100 100" width="300" height="300" class="dark:text-neutral-300">
  <g transform="translate(50 50)">
    <circle cx="0" cy="0" r={circleRadius} fill="none" stroke="currentColor" stroke-width="5" class="text-gray-500/50"></circle>

    {#if isRunning}
      {#if mode === 'countdown'}
        <circle
          cx="0"
          cy="0"
          r={circleRadius}
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-dasharray="{fraction * 2 * circleRadius * Math.PI} 999"
          stroke-linecap="round"
          style="transform: rotate(-90deg)"
          class="text-amber-500/50"
        />
      {/if}
      {#if mode === 'satellite'}
        <g transform="rotate({fraction * 360})">
          <circle cx="-1.5" cy={-circleRadius} r="3" fill="currentColor" class="text-blue-600" />
        </g>
      {/if}
    {/if}

    {#if mode === 'satellite'}
      <rect x="-1" y={circleRadius - 3 - 2} width="2" height="2" fill="currentColor" class="text-blue-600" />
      <rect x="-1" y={-circleRadius + 3} width="2" height="2" fill="currentColor" class="text-blue-600" />
      <rect x={circleRadius - 3 - 2} y="-1" width="2" height="2" fill="currentColor" class="text-blue-600" />
      <rect x={-circleRadius + 3} y="-1" width="2" height="2" fill="currentColor" class="text-blue-600" />
    {/if}

    <text text-anchor="middle" fill="currentColor" dominant-baseline="middle" font-size="10" class="font-light tracking-wider">
      {text}
    </text>
  </g>
</svg>
