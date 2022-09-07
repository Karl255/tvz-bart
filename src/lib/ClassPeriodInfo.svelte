<script lang="ts">
	import type { ClassPeriod } from "./types/api";

	export let classPeriod: ClassPeriod | null = null;
</script>

{#if classPeriod}
	<p><b>ID:</b> {classPeriod.id}</p>
	<p><b>Color:</b> {classPeriod.apiColor}</p>
	<p>{classPeriod.start.toString({ smallestUnit: "minutes" })} - {classPeriodendo.toString({ smallestUnit: "minutes" })}</p>
	<p><b>{classPeriod.courseName}</b></p>
	<p>{classPeriod.className}</p>
	<p>{classPeriod.classType}</p>
	<p>{classPeriod.professor}</p>
	<p>{classPeriod.classroom}</p>
	{#if classPeriod.amountOfStudents}
		<p>{classPeriod.amountOfStudents}</p>
	{/if}
{/if}

<style lang="scss">
</style>
