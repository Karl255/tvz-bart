import type { Handler } from "@netlify/functions";
import { makeForwardHandler } from "../functions-lib/functions-helpers";
import endpoints from "../functions-lib/endpoints";

const handler: Handler = makeForwardHandler(endpoints.departments);

export { handler };
