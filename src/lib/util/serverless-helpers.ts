import { buildUrl } from "$lib/util/url-util";
import type { Handler } from "@netlify/functions";

export function makeForwardingHandler(forwardToUrl: string): Handler {
	return async (event, _context) => {
		const { queryStringParameters } = event;

		const url = buildUrl(forwardToUrl, undefined, queryStringParameters as Record<string, string | number>);
		const result = await fetch(url.toString());

		return {
			statusCode: result.status,
			body: await result.text(),
		};
	};
}
