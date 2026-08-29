<script lang="ts">
	import {
		Html,
		Head,
		Preview,
		Body,
		Container,
		Section,
		Text,
		Button,
		Hr
	} from 'better-svelte-email';

	let { name = 'there', actionUrl = 'http://localhost:5173' } = $props<{
		name?: string;
		actionUrl?: string;
	}>();
</script>

<Html>
	<Head />
	<Preview preview={`Welcome to the platform, ${name}!`} />
	<Body class="bg-gray-50 font-sans text-gray-900">
		<Container class="mx-auto my-8 max-w-145 rounded-lg border border-gray-200 bg-white p-6">
			<Section>
				<Text class="mb-4 text-2xl font-bold">Welcome aboard, {name}!</Text>
				<Text class="text-base leading-6 text-gray-700">
					Thanks for signing up. Click the button below to verify your account and get started.
				</Text>
				<Button
					href={actionUrl}
					class="mt-4 inline-block rounded-md bg-black px-6 py-3 text-sm font-semibold text-white"
				>
					Confirm Email
				</Button>
				<Hr class="my-6 border-gray-200" />
				<Text class="text-xs text-gray-400">
					If you did not sign up for this account, please ignore this email.
				</Text>
			</Section>
		</Container>
	</Body>
</Html>
