<script lang="ts">
	import type { Department } from "$lib/api";
	import { groupBy, partition } from "$lib/util/array-util";

	export let departments: Department[];
	export let selectedDepartmentCode: string;
	export let disabled: boolean;

	function click(e: MouseEvent) {
		const element = e.currentTarget as HTMLButtonElement;

		if (element.dataset.dep) {
			selectedDepartmentCode = element.dataset.dep;
		}
	}

	function groupedByLevel(departments: Department[]): Department[][] {
		return partition(departments, d => d.code.includes("SPEC"));
	}

	function groupedByProgram(departments: Department[]): Department[][] {
		const programGroups = groupBy(departments, d => {
			return d.code.slice(isIzvanredni(d.code) ? 1 : 0);
		});

		return Object.entries(programGroups)
			.map<[string, Department[]]>(([program, group]) => [
				program,
				group.sort((a, b) => a.code.length - b.code.length),
			])
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(tuple => tuple[1]);
	}

	function isIzvanredni(departmentCode: string): boolean {
		return departmentCode.startsWith("I") && departmentCode !== "INF";
	}

	function normalizeDepartmentCode(departmentCode: string): string {
		return departmentCode.replaceAll(/\d/g, "");
	}
</script>

<h2>Select department:</h2>

<div class="department-groups">
	{#if departments}
		{#each groupedByLevel(departments) as departmentsInLevel}
			<div class="level-groups">
				{#each groupedByProgram(departmentsInLevel) as departmentsInProgram}
					<div class="program">
						{#each departmentsInProgram as department}
							<button
								class="btn {isIzvanredni(department.code) ? 'izvanredni' : 'redovni'}"
								on:click={click}
								data-dep={department.code}
								title={department.name}
								{disabled}
							>
								{normalizeDepartmentCode(department.code)}
							</button>
						{/each}
					</div>
				{/each}
			</div>
		{/each}
	{/if}
</div>

<style lang="scss">
	h2 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;

		:global(*) + & {
			margin-top: 1.5rem;
		}
	}

	.department-groups {
		display: flex;
		flex-flow: row wrap;
		gap: 2rem;
	}

	.level-groups {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}

	.program {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: repeat(2, 1fr);
		grid-template-areas: "redovni" "izvanredni";
		gap: 0.5rem;
	}

	.redovni {
		grid-area: redovni;
	}

	.izvanredni {
		grid-area: izvanredni;
	}
</style>
