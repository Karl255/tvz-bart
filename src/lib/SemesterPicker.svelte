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

<div class="group">
	{#each availableSemesters as semester, i}
		<button style="grid-column: {semester.semester};" data-i={i} on:click={click}>{semester.subdepartment} - {semester.semester}</button>
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
</style>
