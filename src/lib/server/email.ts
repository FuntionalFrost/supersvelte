import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import { render } from 'svelte/server';

// Base raw email dispatcher
export async function sendEmail({
	to,
	subject,
	html,
	text
}: {
	to: string;
	subject: string;
	html: string;
	text?: string;
}) {
	if (!env.RESEND_API_KEY) {
		console.warn(`[Resend Local / Dry Run] Email to ${to}: ${subject}`);
		return { data: { id: 'mock-email-id' }, error: null };
	}

	try {
		const resend = new Resend(env.RESEND_API_KEY);
		return await resend.emails.send({
			from: env.EMAIL_FROM || 'SuperSvelte <notifications@yourdomain.com>',
			to,
			subject,
			html,
			text
		});
	} catch (err: unknown) {
		console.error('[Resend Error] Failed to dispatch email:', err);
		return { data: null, error: err as Error };
	}
}

// Svelte-component-driven template helper
export async function sendWelcomeEmail({
	to,
	name,
	actionUrl
}: {
	to: string;
	name: string;
	actionUrl: string;
}) {
	// Dynamic import avoids crashing CLI tools (like better-auth generate & seed scripts)
	const { default: WelcomeEmail } = await import('$lib/emails/WelcomeEmail.svelte');

	const { body: html } = render(WelcomeEmail, {
		props: { name, actionUrl }
	});

	return await sendEmail({
		to,
		subject: `Welcome to the app, ${name}!`,
		html
	});
}
