// src/lib/server/paddle.ts
import { env } from '$env/dynamic/private';
import { PUBLIC_PADDLE_ENV } from '$env/static/public';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';

if (!env.PADDLE_API_KEY) {
	throw new Error('[Paddle Error] PADDLE_API_KEY is not defined in private environment variables.');
}

// 1. Initialize Paddle Server-Side SDK
export const paddle = new Paddle(env.PADDLE_API_KEY, {
	environment: PUBLIC_PADDLE_ENV === 'production' ? Environment.production : Environment.sandbox
});

// 2. Automated GitHub Repository Provisioning Helper
export async function inviteBuyerToGithub(githubUsernameOrEmail: string) {
	const token = env.GITHUB_PAT;
	const owner = env.GITHUB_REPO_OWNER;
	const repo = env.GITHUB_REPO_NAME;

	if (!token || !owner || !repo) {
		console.warn(
			'⚠️ [GitHub Invite] Missing GITHUB_PAT, GITHUB_REPO_OWNER, or GITHUB_REPO_NAME in environment variables.'
		);
		return;
	}

	try {
		// GitHub API: Add collaborator to private repository
		const response = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/collaborators/${encodeURIComponent(githubUsernameOrEmail)}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/vnd.github+json',
					'X-GitHub-Api-Version': '2022-11-28'
				},
				body: JSON.stringify({ permission: 'pull' })
			}
		);

		if (response.ok) {
			console.log(`✅ GitHub repository invite sent to: ${githubUsernameOrEmail}`);
		} else {
			const errorData = await response.json();
			console.error(`❌ GitHub API invite failed for ${githubUsernameOrEmail}:`, errorData);
		}
	} catch (err) {
		console.error(`❌ Unexpected error inviting ${githubUsernameOrEmail} to GitHub:`, err);
	}
}
