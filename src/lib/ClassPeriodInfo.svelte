<script lang="ts">
	import type { ClassPeriod } from "$lib/api/schedule";

	export let classPeriod: ClassPeriod | null = null;
</script>

{#if classPeriod}
	<p><b>ID:</b> {classPeriod.id}</p>
	<p><b>Color:</b> {classPeriod.apiColor}</p>
	<p>{classPeriod.start.toString({ smallestUnit: "minutes" })} - {classPeriod.end.toString({ smallestUnit: "minutes" })}</p>
	<p><b>{classPeriod.courseName}</b></p>
	<p>{classPeriod.className}</p>
	<p>{classPeriod.classType}</p>
	<p>{classPeriod.professor}</p>
	<p>{classPeriod.classroom}</p>
	{#if classPeriod.amountOfStudents}
		<p>{classPeriod.amountOfStudents} upisanih studenata.</p>
	{/if}
	{#if classPeriod.group}
		<p><b>Grupa:</b> {classPeriod.group}</p>
	{/if}
	{#if classPeriod.note}
		<p><b>Napomena:</b> {classPeriod.note}</p>
	{/if}
{:else}
	<slot></slot>
{/if}

<style lang="scss">
</style>
