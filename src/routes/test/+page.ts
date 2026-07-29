// src/routes/test/+page.ts
import { api } from '$lib/api-client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, data }) => {
	let initialRpcStatus: string;
	let initialRpcCount = 0;

	try {
		const res = await api.api.projects.$get({ fetch });
		if (res.ok) {
			const json = await res.json();
			initialRpcStatus = '200 OK (Loaded via +page.ts)';
			initialRpcCount = json.projects.length;
		} else {
			initialRpcStatus = `Error ${res.status}: ${res.statusText}`;
		}
	} catch (err: unknown) {
		initialRpcStatus = err instanceof Error ? err.message : 'Network failure';
	}

	return {
		...data, // Forwards 'form' and 'existingProjects' from +page.server.ts
		rpcDiagnostics: {
			status: initialRpcStatus,
			count: initialRpcCount
		}
	};
};
