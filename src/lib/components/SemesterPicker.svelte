<script lang="ts">
	import type { Semester } from "$lib/api";

	export let promisedSemesters: Promise<Semester[]>;
	export let selectedSemester: Semester;
	export let disabled: boolean;

	let semesters: Semester[] = [];

	$: promisedSemesters.then(retrievedSemesters => {
		semesters = retrievedSemesters;
	});

	function pickSemester(semester: Semester) {
		selectedSemester = semester;
	}
</script>

<h2>Select semester:</h2>

<div class="group">
	{#each semesters as semester}
		{@const selected =
			semester.subdepartment === selectedSemester.subdepartment &&
			semester.semester === selectedSemester.semester}

		<button
			class="btn"
			class:btn--pushed-down={selected}
			style:grid-column={semester.semester}
			on:click={() => pickSemester(semester)}
			disabled={disabled || selected}
		>
			{semester.subdepartment} - {semester.semester}
		</button>
	{/each}
</div>

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
