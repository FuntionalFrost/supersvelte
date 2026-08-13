// src/lib/server/email.ts
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

export const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
	try {
		const from = 'Acme <onboarding@resend.dev>';
		const res = await resend.emails.send({
			from,
			to,
			subject,
			html
		});

		if (res.error) {
			console.error('[Resend Email Error]:', res.error);
			return { success: false, error: res.error };
		}

		return { success: true, data: res.data };
	} catch (error) {
		console.error('[Resend Email Exception]:', error);
		return { success: false, error };
	}
}
