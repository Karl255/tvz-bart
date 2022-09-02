import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";

const baseURL = "https://homer.tvz.hr/CalendarJson";

function buildURL(params: any): URL {
	const url = new URL(baseURL);

	for (const key in params) {
		url.searchParams.append(key, params[key].toString());
	}
	
	url.searchParams.append("_", Date.now().toString());
	
	return url;
}

const handler: Handler = async (event, context) => {
	const { queryStringParameters } = event;
	
	const url = buildURL(queryStringParameters);
	
	const result = await fetch(url.toString());
	
	return {
		statusCode: result.status,
		body: await result.text(),
	};
};

export { handler };
