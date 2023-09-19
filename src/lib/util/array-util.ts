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
