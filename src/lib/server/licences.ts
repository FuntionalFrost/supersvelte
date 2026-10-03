// src/lib/server/licences.ts
import { GITHUB_ADMIN_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } from '$app/env/private';

/**
 * Automates inviting a customer to the private SuperSvelte repository on GitHub
 */
export async function inviteBuyerToGithub(githubUsername: string): Promise<boolean> {
	if (!GITHUB_ADMIN_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
		console.warn('GitHub environment variables not configured; skipping repo invite.');
		return false;
	}

	try {
		const res = await fetch(
			`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/collaborators/${githubUsername}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
					Accept: 'application/vnd.github.v3+json',
					'User-Agent': 'SuperSvelte-Fulfillment'
				},
				body: JSON.stringify({ permission: 'pull' })
			}
		);

		return res.ok || res.status === 204;
	} catch (err) {
		console.error('Failed to invite collaborator to GitHub:', err);
		return false;
	}
}
