<!-- src/routes/(auth)/login/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form);
	const { form: formData, enhance, submitting, message } = form;
</script>

<div class="space-y-6 rounded-xl border border-border bg-card p-6 shadow-xs">
	<div class="space-y-1 text-center">
		<h1 class="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
		<p class="text-xs text-muted-foreground">Enter your credentials to access your account</p>
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
					<Form.Label class="text-xs font-semibold">Email</Form.Label>
					<Input
						{...props}
						type="email"
						placeholder="name@example.com"
						bind:value={$formData.email}
						class="text-xs"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-[11px]" />
		</Form.Field>

		<!-- PASSWORD FIELD -->
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-xs font-semibold">Password</Form.Label>
					<Input
						{...props}
						type="password"
						placeholder="••••••••"
						bind:value={$formData.password}
						class="text-xs"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-[11px]" />
		</Form.Field>

		<Button type="submit" disabled={$submitting} class="w-full text-xs font-bold">
			{$submitting ? 'Signing in...' : 'Sign In'}
		</Button>
	</form>

	<div class="text-center text-xs text-muted-foreground">
		Don't have an account yet?
		<a href={resolve('/signup')} class="font-semibold text-primary hover:underline"> Sign Up </a>
	</div>
</div>
