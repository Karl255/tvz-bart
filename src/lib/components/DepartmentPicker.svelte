<script lang="ts">
	import type { Department } from "$lib/models/api";
	import { groupBy, partition } from "$lib/util/array-util";
	import { normalizeDepartment } from "$lib/util/other";

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
			return normalizeDepartment(d.code);
		});

		return Object.entries(programGroups)
			.map<[string, Department[]]>(([program, group]) => [
				program,
				group.sort((a, b) => a.code.length - b.code.length),
			])
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(tuple => tuple[1]);
	}

	function isRedovni(departmentCode: string): boolean {
		return normalizeDepartment(departmentCode) === departmentCode;
	}

	function removeDigits(str: string): string {
		return str.replaceAll(/\d/g, "");
	}
</script>

<h2>Odaberi odjel:</h2>

<div class="department-groups">
	{#if departments}
		{#each groupedByLevel(departments) as departmentsInLevel}
			<div class="level-groups">
				{#each groupedByProgram(departmentsInLevel) as departmentsInProgram}
					<div class="program">
						{#each departmentsInProgram as department}
							{@const selected = department.code === selectedDepartmentCode}
							<button
								class="btn {isRedovni(department.code) ? 'redovni' : 'izvanredni'}"
								class:btn--pushed-down={selected}
								on:click={click}
								data-dep={department.code}
								title={department.name}
								disabled={disabled || selected}
							>
								{removeDigits(department.code)}
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
