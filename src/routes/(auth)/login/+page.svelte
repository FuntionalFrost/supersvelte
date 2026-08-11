<!-- src/routes/(auth)/login/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form);
	const { form: formData, enhance, submitting, message } = form;
</script>

<div class="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
	<div class="space-y-1 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
		<p class="text-sm text-muted-foreground">Enter your credentials to access your account</p>
	</div>

	<!-- Render error message from setMessage -->
	{#if $message}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-center text-xs font-medium text-destructive"
		>
			{$message}
		</div>
	{/if}

	<form method="POST" use:enhance class="space-y-4">
		<!-- EMAIL FIELD -->
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input
						{...props}
						type="email"
						placeholder="name@example.com"
						bind:value={$formData.email}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- PASSWORD FIELD -->
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input {...props} type="password" bind:value={$formData.password} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Button type="submit" disabled={$submitting} class="w-full">
			{$submitting ? 'Signing in...' : 'Sign In'}
		</Button>
	</form>
</div>
