<script lang="ts">
	export let name: string;
	export let query: string;
	export let disabled: boolean | undefined;

	export let setQuery: (query: string) => void;
</script>

<button
	class="example"
	on:click={() => setQuery(query)}
	{disabled}
>
	<p class="example__header">{name}</p>
	<p class="example__body monospace">
		{query}
	</p>
</button>

<style lang="scss">
	.example {
		display: flex;
		flex-direction: column;

		background-color: rgb(from var(--clr-element) r g b / 0);
		border: 1px solid var(--clr-element);
		border-radius: 0.5rem;
		padding: 0;
		max-height: 20rem;
		overflow: hidden;

		text-align: left;

		cursor: pointer;

		transition: background-color 100ms ease-out, border-color 100ms ease-out;

		&__header {
			background-color: var(--clr-element);
			padding: 0.25rem 0.5rem;
		}

		&__body {
			$_shadow: 1rem;
			flex-grow: 1;
			padding: 0.5rem;
			box-shadow: inset 0 calc($_shadow * -1) $_shadow calc($_shadow * -1) black;

			text-overflow: ellipsis;
			white-space: pre;
			overflow: hidden;
		}

		&:hover {
			border-color: var(--clr-element-border);
			background-color: var(--clr-element);
		}
	}

	.monospace {
		font-family: monospace;
	}
</style>
