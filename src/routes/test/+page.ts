// src/routes/test/+page.ts
import { client } from '$lib/api-client';

export const load = async ({ fetch, data }) => {
	let initialRpcStatus: string;
	let initialRpcCount = 0;

	try {
		const res = await client.api.projects.$get({}, { fetch });

		if (res.ok) {
			const json = await res.json();
			initialRpcStatus = '200 OK (Loaded via +page.ts)';
			initialRpcCount = json.projects?.length ?? 0;
		} else {
			initialRpcStatus = `Error ${res.status}: ${res.statusText}`;
		}
	} catch (err: unknown) {
		initialRpcStatus = err instanceof Error ? err.message : 'Network failure';
	}

	return {
		...data,
		rpcDiagnostics: {
			status: initialRpcStatus,
			count: initialRpcCount
		}
	};
};
