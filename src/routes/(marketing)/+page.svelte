<!-- src/routes/(marketing)/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="mx-auto flex min-h-screen max-w-5xl flex-col justify-between p-6">
	<header class="flex items-center justify-between border-b border-border py-4">
		<span class="text-xl font-bold tracking-tight">Super Svelte</span>
		<div class="flex gap-2">
			<a href={resolve('/login')}><Button variant="ghost" size="sm">Sign In</Button></a>
			<a href={resolve('/dashboard')}><Button size="sm">Dashboard</Button></a>
		</div>
	</header>

	<main class="flex flex-1 flex-col items-center justify-center space-y-6 py-12 text-center">
		<h1 class="text-4xl font-extrabold tracking-tight md:text-6xl">
			Build Faster with Svelte 5 & Modern RPC
		</h1>
		<p class="max-w-xl text-sm text-muted-foreground md:text-base">
			Fully wired with Better Auth, Drizzle, Neon Postgres, Superforms, and Hono. Clean, type-safe,
			and ready for production.
		</p>
		<div class="flex gap-4">
			<a href={resolve('/login')}><Button size="lg">Get Started</Button></a>
			<a href={resolve('/test')}><Button variant="outline" size="lg">Run Diagnostics</Button></a>
		</div>
	</main>

	<footer class="border-t border-border py-4 text-center text-xs text-muted-foreground">
		© SaaS Core. All rights reserved.
	</footer>
</div>
