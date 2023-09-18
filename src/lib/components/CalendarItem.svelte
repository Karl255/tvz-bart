<script lang="ts">
	import { ClassType, type ClassPeriodSegregated } from "$lib/api";

	export let classPeriod: ClassPeriodSegregated;
	$: c = classPeriod;

	const start = classPeriod.start.hour + classPeriod.start.minute / 60;
	const end = classPeriod.end.hour + classPeriod.end.minute / 60;

	function classTypeToStyleClass(type: ClassType): string {
		let r: string = "other";

		switch (type) {
			case ClassType.Lecture:           r = "lecture"; break;
			case ClassType.AuditoryExercises: r = "auditory"; break;
			case ClassType.Lab:               r = "lab"; break;
			default:                          r = "other"; break;
		}
		
		return r;
	}
</script>

<div class="item-column type-{classTypeToStyleClass(c.classType)}" style="--start: {start}; --end: {end}; --column: {c.column}; --width: {c.width};">
	<!-- TODO: v -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="item" on:click on:mouseenter on:mouseleave data-id={c.id}>
		<p class="hidden">id = {c.id}</p>
		<p class="timestamp">{c.start.toString({ smallestUnit: "minutes" })} - {c.end.toString({ smallestUnit: "minutes" })}</p>
		<p class="class-name">{c.className}</p>
	</div>
</div>

<style lang="scss">
	.item-column {
		grid-column: var(--column) / span var(--width);
		grid-row: 1;
		position: relative;
	}

	.item {
		background-color: var(--background-color);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		padding: 0.2rem;

		position: absolute;
		top: calc((var(--start) - var(--from-hour)) / var(--hour-range) * 100%);
		bottom: calc((var(--to-hour) - var(--end)) / var(--hour-range) * 100%);
		left: 0;
		right: 0;

		z-index: 10;
		overflow: clip;
	}

	.timestamp {
		font-size: 0.75rem;
		line-height: 1;
		white-space: nowrap;
	}

	.class-name {
		font-size: 0.875rem;
		font-weight: 600;
	}
	
	.hidden {
		display: none;
	}
	
	.type-lecture {
		--background-color: var(--clr-lecture-background);
		--border-color: var(--clr-lecture-border);
	}
	
	.type-auditory {
		--background-color: var(--clr-auditory-background);
		--border-color: var(--clr-auditory-border);
	}
	
	.type-lab {
		--background-color: var(--clr-lab-background);
		--border-color: var(--clr-lab-border);
	}
	
	.type-other {
		--background-color: var(--clr-other-background);
		--border-color: var(--clr-other-border);
	}
</style>
