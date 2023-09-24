import { makeForwardingHandler } from "$lib/util/serverless-helpers";
import type { Handler } from "@netlify/functions";
import { remoteEndpoints } from "./endpoints";

const handler: Handler = makeForwardingHandler(remoteEndpoints.userSchedule);

export { handler };
