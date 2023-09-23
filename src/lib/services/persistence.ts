import { writable, type Writable } from "svelte/store";

export function persistent<T>(key: string, defaultValue: T): Writable<T> {
	const stored = localStorage.getItem(key);
	const store = writable(stored ? (JSON.parse(stored) as T) : defaultValue);

	store.subscribe(value => {
		localStorage.setItem(key, JSON.stringify(value));
	});

	return store;
}
