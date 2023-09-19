import { buildUrl } from "$lib/util/url";
import type { Handler } from "@netlify/functions";

export function makeForwardingHandler(forwardToUrl: string): Handler {
	return async event => {
		const { queryStringParameters } = event;

		const url = buildUrl(forwardToUrl, queryStringParameters as Record<string, string | number>);
		const result = await fetch(url.toString());

		return {
			statusCode: result.status,
			body: await result.text(),
		};
	};
}
