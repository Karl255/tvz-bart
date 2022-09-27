<script lang="ts">
	import type { ClassPeriodSegregated } from "$lib/api/schedule";

	export let classPeriod: ClassPeriodSegregated;
	$: c = classPeriod;

	let start = classPeriod.start.hour + classPeriod.start.minute / 60;
	let end = classPeriod.end.hour + classPeriod.end.minute / 60;
</script>

<div class="item" style="--start: {start}; --end: {end}; --color: {c.apiColor}; --column: {c.column}; --width: {c.width};">
	<div class="item__container" on:click on:mouseenter on:mouseleave data-id={c.id}>
		<p class="timestamp">{c.start.toString({ smallestUnit: "minutes" })} - {c.end.toString({ smallestUnit: "minutes" })}</p>
		<p class="class-name">{c.className}</p>
	</div>
</div>

<style lang="scss">
	.item {
		grid-column: var(--column) / span var(--width);
		grid-row: 1;
		position: relative;

		&__container {
			background-color: hsl(240 10% 18%);
			border: 1px solid var(--color, #0b67a5);
			padding: 0.2rem;

			position: absolute;
			top: calc((var(--start) - var(--from-hour)) / var(--hour-range) * 100%);
			bottom: calc((var(--to-hour) - var(--end)) / var(--hour-range) * 100%);
			left: 0;
			right: 0;

			z-index: 10;
			overflow: clip;
		}
	}

	.timestamp {
		font-size: 0.75rem;
	}

	.class-name {
		font-size: 0.875rem;
		font-weight: 600;
	}
</style>
