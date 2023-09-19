export function buildUrl(endpoint: string, base: string | undefined, params: Record<string, string | number>): URL {
	const url = new URL(endpoint, base);

	for (const key in params) {
		url.searchParams.append(key, params[key].toString());
	}

	url.searchParams.append("_", Date.now().toString());

	return url;
}
