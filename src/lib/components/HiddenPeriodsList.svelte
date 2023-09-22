<script lang="ts">
	import { ClassType } from "$lib/api";
	import type { ClassPeriodIdentifier } from "$lib/models/scheduleFiltering";
	import type { StringPlainTime } from "$lib/models/temporal";
	import { Temporal } from "@js-temporal/polyfill";

	export let hiddenItems: ClassPeriodIdentifier[];
	export let onUnhideItem: (identifier: ClassPeriodIdentifier) => void;

	function classTypeToStyleClass(type: ClassType): string {
		let r: string = "other";

		// prettier-ignore
		switch (type) {
			case ClassType.Lecture:           r = "lecture"; break;
			case ClassType.AuditoryExercises: r = "auditory"; break;
			case ClassType.Lab:               r = "lab"; break;
			default:                          r = "other"; break;
		}

		return r;
	}

	function formatTime(timestamp: StringPlainTime): string {
		const end = timestamp.lastIndexOf(":");
		return timestamp.substring(0, end);
	}

	function dayOfWeekName(dayOfWeek: number): string {
		const names = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
		return names[dayOfWeek];
	}

	function orderItems(items: ClassPeriodIdentifier[]): ClassPeriodIdentifier[] {
		return [...items].sort((first, second) => {
			return (
				first.dayOfWeek - second.dayOfWeek ||
				Temporal.PlainTime.compare(first.start, second.start) ||
				-Temporal.PlainTime.compare(first.end, second.end)
			);
		});
	}
</script>

<div class="list">
	{#each orderItems(hiddenItems) as item}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="item type-{classTypeToStyleClass(item.classType)}"
			role="button"
			tabindex="0"
			on:click={() => onUnhideItem(item)}
		>
			<p class="timestamp">
				<span>{formatTime(item.start)} - {formatTime(item.end)}</span>
				<span>{dayOfWeekName(item.dayOfWeek)}</span>
			</p>
			<p class="class-name">{item.className}</p>
		</div>
	{/each}
</div>

<p class="hint">Click to unhide</p>

<style lang="scss">
	.hint {
		font-style: italic;
		margin-top: 1rem;
	}

	.list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		grid-auto-rows: 90px;
		gap: 1rem;
	}

	.item {
		background-color: var(--background-color);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		padding: 0.2rem;

		overflow: clip;
		cursor: pointer;
	}

	.timestamp {
		font-size: 0.75rem;
		line-height: 1;
		white-space: nowrap;

		display: flex;
		justify-content: space-between;
	}

	.class-name {
		font-size: 0.875rem;
		font-weight: 600;
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
