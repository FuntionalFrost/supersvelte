// src/lib/server/licences.ts
import { env } from '$env/dynamic/private';

/**
 * Automates inviting a customer to the private SuperSvelte repository on GitHub
 */
export async function inviteBuyerToGithub(githubUsername: string): Promise<boolean> {
	if (!env.GITHUB_ADMIN_TOKEN || !env.GITHUB_REPO_OWNER || !env.GITHUB_REPO_NAME) {
		console.warn('GitHub environment variables not configured; skipping repo invite.');
		return false;
	}

	try {
		const res = await fetch(
			`https://api.github.com/repos/${env.GITHUB_REPO_OWNER}/${env.GITHUB_REPO_NAME}/collaborators/${githubUsername}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${env.GITHUB_ADMIN_TOKEN}`,
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
