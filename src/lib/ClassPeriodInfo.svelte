<script lang="ts">
	import { dateToStringHHMM } from "./helpers";
	import type { ClassPeriod } from "./types/api";

	export let classPeriod: ClassPeriod | null = null;
</script>

{#if classPeriod}
	<p><b>ID:</b> {classPeriod.id}</p>
	<p><b>Color:</b> {classPeriod.apiColor}</p>
	<p>{dateToStringHHMM(classPeriod.from)} - {dateToStringHHMM(classPeriod.to)}</p>
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
