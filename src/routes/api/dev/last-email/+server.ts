// src/routes/api/dev/last-email/+server.ts
import { getLatestDevEmail } from '$lib/server/email';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	const email = getLatestDevEmail();

	if (url.searchParams.get('format') === 'json') {
		return json({
			email: email || null
		});
	}

	if (!email) {
		return new Response(
			`<!DOCTYPE html>
			<html>
			<body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #09090b; color: #a1a1aa;">
				<div style="text-align: center; border: 1px dashed #27272a; padding: 2rem; border-radius: 12px;">
					<h3 style="color: #f4f4f5; margin-top: 0;">No emails dispatched yet in dev session</h3>
					<p style="font-size: 0.875rem;">Trigger a signup, invite, or test action in <code>/test</code> to preview it live here.</p>
				</div>
			</body>
			</html>`,
			{
				headers: { 'Content-Type': 'text/html; charset=utf-8' }
			}
		);
	}

	return new Response(email.html, {
		headers: {
			'Content-Type': 'text/html; charset=utf-8'
		}
	});
};
