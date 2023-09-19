import { remoteEndpoints } from "$lib/const/api";
import type { Handler } from "@netlify/functions";
import { makeForwardingHandler } from "$lib/util/serverless-helpers";

const handler: Handler = makeForwardingHandler(remoteEndpoints.departments);

export { handler };
