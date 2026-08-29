// src/routes/test/+page.ts
import { createApiClient } from '$lib/api-client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, data }) => {
	const rpc = createApiClient(fetch, url.origin);

	let initialRpcStatus: string;
	let initialRpcCount = 0;

	try {
		const res = await rpc.api.projects.$get();

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
