import type { Handler } from "@netlify/functions";

function buildUrl(baseUrl: string, params: Record<string, string | number>): URL {
	const url = new URL(baseUrl);

	for (const key in params) {
		url.searchParams.append(key, params[key].toString());
	}

	url.searchParams.append("_", Date.now().toString());

	return url;
}

export function makeForwardHandler(baseUrl: string): Handler {
	return async (event, context) => {
		const { queryStringParameters } = event;

		const url = buildUrl(baseUrl, queryStringParameters as Record<string, string | number>);
		const result = await fetch(url.toString());

		return {
			statusCode: result.status,
			body: await result.text(),
		};
	};
}
