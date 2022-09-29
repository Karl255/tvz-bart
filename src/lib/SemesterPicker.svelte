<script lang="ts">
	import type { Semester } from "$lib/api/semesters";

	export let availableSemesters: Semester[] = [];
	export let semester: Semester | null;

	function click(e: MouseEvent) {
		const element = e.currentTarget as HTMLButtonElement;

		if (element.dataset.i) {
			semester = availableSemesters[Number(element.dataset.i)];
		}
	}
</script>

{#if availableSemesters.length > 0}
	<h2>Select semester:</h2>
	<div class="group">
		{#each availableSemesters as semester, i}
			<button class="btn" style="grid-column: {semester.semester};" data-i={i} on:click={click}>{semester.subdepartment} - {semester.semester}</button>
		{/each}
	</div>
{/if}

<style lang="scss">
	.group {
		display: grid;
		grid-template-columns: repeat(6, auto);
		grid-auto-rows: auto;
		grid-auto-flow: dense;
		gap: 0.5rem;
		place-content: start;
	}

	h2 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;

		:global(*) + & {
			margin-top: 1.5rem;
		}
	}
</style>
