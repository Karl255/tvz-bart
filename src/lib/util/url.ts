export function buildUrl(base: string, params: Record<string, string | number>): URL {
	const url = new URL(base, document.URL);

	for (const key in params) {
		url.searchParams.append(key, params[key].toString());
	}

	url.searchParams.append("_", Date.now().toString());

	return url;
}
