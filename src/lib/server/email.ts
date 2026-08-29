import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import { render } from 'svelte/server';

const resend = new Resend(env.RESEND_API_KEY);

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
	return await resend.emails.send({
		from: env.EMAIL_FROM || 'App <notifications@yourdomain.com>',
		to,
		subject,
		html,
		text
	});
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
