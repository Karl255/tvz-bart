export function partition<T1, T2>(items: (T1 | T2)[], predicate: (item: T1 | T2) => boolean): [T1[], T2[]] {
	return items.reduce<[T1[], T2[]]>(
		(acc, item) => {
			if (predicate(item)) {
				acc[1].push(item as T2);
			} else {
				acc[0].push(item as T1);
			}

			return acc;
		},
		[[], []],
	);
}

export function groupBy<T>(items: T[], keyExtractor: (item: T) => string): { [key: string]: T[] } {
	return items.reduce<{ [key: string]: T[] }>((groups, item) => {
		const key = keyExtractor(item);

		(groups[key] = groups[key] || []).push(item);

		return groups;
	}, {});
}
