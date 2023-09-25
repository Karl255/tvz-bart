<script lang="ts">
	import { onDestroy, setContext } from "svelte";
	import { writable } from "svelte/store";
	import type { TabData, TabsContext } from "$lib/components/tabs/";

	let tabs: TabData[] = [];
	const selectedTab = writable<TabData | null>(null);

	setContext<TabsContext>("tabs", {
		registerTab: (tab: TabData) => {
			if (!tabs.find(t => t === tab)) {
				tabs.push(tab);
				tabs = tabs;
				selectedTab.update(value => value ?? tab);
			}

			onDestroy(() => {
				const i = tabs.indexOf(tab);
				tabs.splice(i, 1);
				selectedTab.update(value => (value === tab ? tabs[i - 1] ?? tabs[i] ?? null : value));
			});
		},

		refreshTabData: () => {
			tabs = tabs;
		},

		selectedTab,
	});

	function selectTab(tab: TabData) {
		selectedTab.set(tab);
	}
</script>

<ul class="tab-list">
	{#each tabs as tab}
		<li>
			<button
				class="tab-button"
				class:selected={$selectedTab === tab}
				on:click={() => selectTab(tab)}
			>
				{tab.title}
			</button>
		</li>
	{:else}
		<!-- so content doesn't jump around as the tabs are generated -->
		<li>
			<button class="tab-button selected">&nbsp;</button>
		</li>
	{/each}
</ul>

<div class="tab-panels">
	<slot />
</div>

<style lang="scss">
	.tab-list {
		display: flex;
		list-style: none;
		margin: 0 0 -1px 0;
		padding: 0;
		position: relative;
		z-index: 3;

		> li {
			display: block;
		}
	}

	.tab-button {
		background-color: transparent;
		border: 1px solid transparent;
		border-radius: 0.5rem 0.5rem 0 0;
		padding: 0.5rem 1rem;

		font-weight: 600;
		display: block;
		cursor: pointer;

		&:hover {
			background-color: var(--clr-panel-border);
		}

		&.selected {
			background-color: var(--clr-panel-bg);
			border-color: var(--clr-panel-border);
			border-bottom-color: var(--clr-panel-bg);
			cursor: default;
			pointer-events: none;
		}
	}

	.tab-panels {
		display: grid;
		align-items: start;
		position: relative;
		z-index: 2;

		> :global(*) {
			grid-column: 1;
			grid-row: 1;
		}
	}
</style>
