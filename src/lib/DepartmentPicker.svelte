<script lang="ts">
	import { browser } from "$app/environment";
	import { type Department, fetchDepartments, parseNewDepartments } from "$lib/api/departments";

	export let departmentCode: string;
	let newDepartments: Department[] | null = null;

	if (browser) {
		loadDepartments();
	}

	async function loadDepartments() {
		let deps = await fetchDepartments();
		newDepartments = parseNewDepartments(deps);
		console.log(`${newDepartments.length} new departments found`);
	}

	function click(e: MouseEvent) {
		const element = e.currentTarget as HTMLButtonElement;

		if (element.dataset.dep) {
			departmentCode = element.dataset.dep;
		}
	}
</script>

<div class="groups">
	<div class="group">
		<div class="col">
			<button on:click={click} data-dep="ELO">ELO</button>
			<button on:click={click} data-dep="IELO">IELO</button>
		</div>
		<div class="col">
			<button on:click={click} data-dep="GRA">GRA</button>
			<button on:click={click} data-dep="IGRA">IGRA</button>
		</div>
		<div class="col">
			<button on:click={click} data-dep="INF">INF</button>
			<button on:click={click} data-dep="IINF">IINF</button>
		</div>
		<div class="col">
			<button on:click={click} data-dep="RAC">RAC</button>
			<button on:click={click} data-dep="IRAC">IRAC</button>
		</div>
		<div class="col">
			<button on:click={click} data-dep="STRO">STRO</button>
			<button on:click={click} data-dep="ISTRO">ISTRO</button>
		</div>
		<div class="col">
			<button on:click={click} data-dep="MEH">MEH</button>
			<button on:click={click} data-dep="IMEH">IMEH</button>
		</div>
	</div>

	<div class="group">
		<div class="col">
			<button on:click={click} data-dep="SPECELO1">SPECELO</button>
			<button on:click={click} data-dep="ISPECELO1">ISPECELO</button>
		</div>
		<div class="col">
			<button on:click={click} data-dep="SPECGRA1">SPECGRA</button>
			<button on:click={click} data-dep="ISPECGRA1">ISPECGRA</button>
		</div>
		<div class="col">
			<button on:click={click} data-dep="SPECINF1">SPECINF</button>
			<button on:click={click} data-dep="ISPECINF1">ISPECINF</button>
		</div>
		<div class="col">
			<button on:click={click} data-dep="SPECRAC1">SPECRAC</button>
			<button on:click={click} data-dep="ISPECRAC1">ISPECRAC</button>
		</div>
		<div class="col">
			<button on:click={click} data-dep="SPECSTRO">SPECSTRO</button>
			<button on:click={click} data-dep="ISPECSTRO">ISPECSTRO</button>
		</div>
	</div>

	<div class="new-deps">
		{#if newDepartments}
			{#each newDepartments as newDepartment}
				<button on:click={click} data-dep={newDepartment.code} title={newDepartment.name}>{newDepartment.code}</button>
			{/each}
		{/if}
	</div>
</div>

<style lang="scss">
	.groups {
		display: flex;
		flex-flow: row wrap;
		gap: 2rem;
	}

	.group {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.new-deps {
		display: grid;
		grid-template-rows: repeat(2, 1fr);
		grid-auto-flow: column;
		gap: 0.5rem;
	}
</style>
