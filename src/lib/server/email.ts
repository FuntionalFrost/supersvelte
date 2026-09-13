// src/lib/server/email.ts
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import { render } from 'svelte/server';

export interface DevEmailRecord {
	id: string;
	to: string;
	subject: string;
	html: string;
	text?: string;
	actionUrl?: string;
	timestamp: string;
}

// In-memory development store to enable in-browser preview without a mail server
const devEmailStore: DevEmailRecord[] = [];

export function getLatestDevEmail(): DevEmailRecord | null {
	return devEmailStore.length > 0 ? devEmailStore[devEmailStore.length - 1] : null;
}

export function getAllDevEmails(): DevEmailRecord[] {
	return [...devEmailStore];
}

export function clearDevEmails(): void {
	devEmailStore.length = 0;
}

// Formatted ASCII Box Logger for Console Dev Mode
function logDevEmail(record: DevEmailRecord) {
	const border = '─'.repeat(60);
	console.log(`
┌${border}┐
│ ✉️  [LOCAL DEV EMAIL DISPATCHED]
│ To:      ${record.to.padEnd(51)}│
│ Subject: ${record.subject.slice(0, 50).padEnd(51)}│
│ Time:    ${new Date(record.timestamp).toLocaleTimeString().padEnd(51)}│
${record.actionUrl ? `│ Action:  ${record.actionUrl.slice(0, 50).padEnd(51)}│\n` : ''}│ Live UI: http://localhost:5173/test?tab=email
└${border}┘
`);
}

// Base raw email dispatcher
export async function sendEmail({
	to,
	subject,
	html,
	text,
	actionUrl
}: {
	to: string;
	subject: string;
	html: string;
	text?: string;
	actionUrl?: string;
}) {
	const emailRecord: DevEmailRecord = {
		id: `dev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
		to,
		subject,
		html,
		text,
		actionUrl,
		timestamp: new Date().toISOString()
	};

	// Save to local in-memory store (capped at last 20 emails)
	devEmailStore.push(emailRecord);
	if (devEmailStore.length > 20) {
		devEmailStore.shift();
	}

	// 1. If in test mode or RESEND_API_KEY is not configured, log to console and return dev fallback
	if (!env.RESEND_API_KEY || process.env.NODE_ENV === 'test' || env.NODE_ENV === 'test') {
		logDevEmail(emailRecord);
		return { data: { id: emailRecord.id, mode: 'Console Dev Fallback' }, error: null };
	}

	// 2. Production Resend delivery
	try {
		const resend = new Resend(env.RESEND_API_KEY);
		const res = await resend.emails.send({
			from: env.EMAIL_FROM || 'SuperSvelte <notifications@yourdomain.com>',
			to,
			subject,
			html,
			text
		});
		return res;
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
		subject: `Welcome to SuperSvelte, ${name}!`,
		html,
		actionUrl
	});
}
