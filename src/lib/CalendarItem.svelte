<script lang="ts">
	import type { ClassPeriod } from "./types/api";

	export let classPeriod: ClassPeriod;

	let start = classPeriod.start.hour + classPeriod.start.minute / 60;
	let end = classPeriod.end.hour + classPeriod.end.minute / 60;
</script>

<div class="item" style="--start: {start}; --end: {end}; --color: {classPeriod.apiColor};">
	<p class="timestamp">{classPeriod.start.toString({ smallestUnit: "minutes" })} - {classPeriodendo.toString({ smallestUnit: "minutes" })}</p>
	<p class="class-name">{classPeriod.className}</p>
</div>

<style lang="scss">
	.item {
		background-color: hsl(240 10% 18%);
		border: 1px solid var(--color, #0b67a5);
		padding: 0.2rem;

		position: absolute;
		top: calc((var(--start) - var(--from-hour)) / var(--hour-range) * 100%);
		bottom: calc((var(--to-hour) - var(--end)) / var(--hour-range) * 100%);
		left: 0;
		right: 0;

		overflow: clip;
	}

	.timestamp {
		font-size: 0.75rem;
	}

	.class-name {
		font-size: 0.875rem;
		font-weight: 600;
	}
</style>
