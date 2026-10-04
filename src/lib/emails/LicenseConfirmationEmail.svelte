<!-- src/lib/emails/LicenseConfirmationEmail.svelte -->
<script lang="ts">
	interface Props {
		licenseKey: string;
		transactionId: string;
		actionUrl?: string;
	}

	let {
		licenseKey,
		transactionId,
		actionUrl = 'https://supersvelte.netlify.app/dashboard/billing'
	}: Props = $props();
</script>

<div
	style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 16px;"
>
	<div
		style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);"
	>
		<h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">
			🎉 Thank you for getting SuperSvelte!
		</h1>
		<p style="font-size: 15px; line-height: 24px; color: #475569; margin: 0 0 20px 0;">
			Your payment has been successfully processed. Here are your purchase details:
		</p>
		<div
			style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 13px; line-height: 20px; color: #0f172a; border: 1px solid #e2e8f0;"
		>
			<p style="margin: 0 0 6px 0;"><strong>License Key:</strong> {licenseKey}</p>
			<p style="margin: 0;"><strong>Transaction ID:</strong> {transactionId}</p>
		</div>
		<p style="font-size: 14px; line-height: 22px; color: #475569; margin: 0 0 24px 0;">
			You can access your downloads, manage billing, and invite team members on your dashboard:
		</p>
		<div style="text-align: left; margin: 24px 0;">
			<a
				href={actionUrl}
				style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
			>
				Open Billing Dashboard &rarr;
			</a>
		</div>
		<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 20px 0;" />
		<p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 18px;">
			If you did not authorize this purchase or have questions, reply directly to this email for
			support.
		</p>
	</div>
</div>
