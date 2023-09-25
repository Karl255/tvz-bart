<script lang="ts">
	import type { ClassPeriod } from "$lib/models/api";

	export let classPeriod: ClassPeriod | null = null;

	export let hide: (classPeriod: ClassPeriod) => void;
</script>

{#if classPeriod}
	<p>
		{classPeriod.start.toString({ smallestUnit: "minutes" })} - {classPeriod.end.toString({
			smallestUnit: "minutes",
		})}
	</p>

	<p><strong>{classPeriod.className}</strong></p>
	<p>{classPeriod.classType}</p>
	<p>{classPeriod.classroom}</p>

	{#if classPeriod.group || classPeriod.note}
		<br />
	{/if}

	{#if classPeriod.group}
		<p><b>Grupa:</b> {classPeriod.group}</p>
	{/if}

	{#if classPeriod.note}
		<p><b>Napomena:</b> {classPeriod.note}</p>
	{/if}

	<br />

	{#if classPeriod.professor}
		<p>{classPeriod.professor}</p>
	{/if}

	<div class="courses">
		{#each classPeriod.courseNames.split(",") as courseName}
			<p><strong>{courseName}</strong></p>
		{/each}
	</div>

	<!-- prettier-ignore -->
	<button class="btn" on:click={() => classPeriod && hide(classPeriod)}>
		Sakrij
	</button>
{:else}
	<slot />
{/if}

<style lang="scss">
	.courses > * + * {
		margin-top: 0.5rem;
	}
</style>
