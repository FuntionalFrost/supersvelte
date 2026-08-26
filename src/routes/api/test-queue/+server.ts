import { dispatchEvent } from '$lib/server/queue';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const res = await dispatchEvent({
		type: 'repo.invite',
		payload: {
			githubUsername: 'octocat',
			email: 'octocat@github.com'
		}
	});

	return json({ dispatched: true, res });
};
