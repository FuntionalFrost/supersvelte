<!-- src/lib/emails/WelcomeEmail.svelte -->
<script lang="ts">
	interface Props {
		name?: string;
		actionUrl?: string;
	}

	let { name = 'there', actionUrl = 'https://supersvelte.netlify.app' }: Props = $props();
</script>

<div
	style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 16px;"
>
	<div
		style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);"
	>
		<h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">
			Welcome aboard, {name}!
		</h1>
		<p style="font-size: 15px; line-height: 24px; color: #475569; margin: 0 0 24px 0;">
			Thanks for signing up for SuperSvelte. Please click the button below to verify your email
			address and activate your account.
		</p>
		<div style="text-align: left; margin: 28px 0;">
			<a
				href={actionUrl}
				style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
			>
				Confirm Email Address
			</a>
		</div>
		<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 20px 0;" />
		<p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 18px;">
			If you did not sign up for this account, you can safely ignore this email.
		</p>
	</div>
</div>
