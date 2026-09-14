<!-- src/routes/test/components/S3Tab.svelte -->
<script lang="ts">
	import {
		CheckCircle2,
		Cloud,
		ExternalLink,
		HardDrive,
		Sparkles,
		Upload,
		XCircle
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { useUpload } from 'yaxa-svelte';

	let fileInput = $state<HTMLInputElement | null>(null);
	let uploadedResult = $state<{ key?: string; url: string; filename: string } | null>(null);

	const uploader = useUpload({
		endpoint: '/api/s3/presign',
		onSuccess: () => {
			toast.success(`Uploaded successfully to S3/R2!`);
		},
		onError: (err) => {
			toast.error(err.message || 'Upload failed');
		}
	});

	async function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		uploadedResult = null;
		const res = await uploader.upload(file);
		if (res) {
			uploadedResult = {
				key: res.key,
				url: res.url,
				filename: file.name
			};
		}
		if (fileInput) fileInput.value = '';
	}
</script>

<div class="space-y-6">
	<div class="rounded-2xl border border-border bg-card p-6 shadow-xs">
		<div class="flex items-center gap-3 border-b border-border pb-4">
			<div class="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
				<HardDrive class="size-5" />
			</div>
			<div>
				<div class="flex items-center gap-2">
					<h2 class="text-base font-bold">Cloudflare R2 / AWS S3 Direct Presigned Uploads</h2>
					<span
						class="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
					>
						<Sparkles class="size-2.5" /> yaxa-svelte useUpload()
					</span>
				</div>
				<p class="text-xs text-muted-foreground">
					High-performance browser-to-bucket direct upload engine with $0 egress fees and zero
					vendor lock-in.
				</p>
			</div>
		</div>

		<div class="mt-6 space-y-4">
			<!-- Upload Trigger Area -->
			<div
				class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 text-center transition hover:border-primary/50"
			>
				<Cloud class="mb-3 size-10 text-muted-foreground" />
				<h3 class="text-sm font-semibold">Select a file to test direct presigned PUT upload</h3>
				<p class="mt-1 text-xs text-muted-foreground">
					Powered by <code>useUpload()</code> with reactive streaming byte progress via
					<code>/api/s3/presign</code>.
				</p>

				<input
					type="file"
					bind:this={fileInput}
					onchange={handleFileSelect}
					class="hidden"
					id="s3-file-picker"
				/>

				<button
					onclick={() => fileInput?.click()}
					disabled={uploader.isUploading}
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50"
				>
					<Upload class="size-3.5" />
					<span
						>{uploader.isUploading ? `Uploading (${uploader.progress}%)...` : 'Choose File'}</span
					>
				</button>
			</div>

			<!-- Progress Bar -->
			{#if uploader.isUploading}
				<div class="space-y-1.5 rounded-xl border border-border bg-muted/20 p-4">
					<div class="flex justify-between text-xs font-semibold">
						<span>Streaming to S3/R2 Bucket...</span>
						<span class="font-mono">{uploader.progress}%</span>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-muted">
						<div
							class="h-full bg-primary transition-all duration-150"
							style="width: {uploader.progress}%"
						></div>
					</div>
				</div>
			{/if}

			<!-- Upload Success Card -->
			{#if uploadedResult}
				<div class="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
					<div class="flex items-center gap-2 text-xs font-bold text-emerald-400">
						<CheckCircle2 class="size-4" />
						<span>Direct Upload Succeeded!</span>
					</div>
					<div class="space-y-1 font-mono text-[11px] text-foreground/90">
						{#if uploadedResult.key}
							<div><strong>Key:</strong> {uploadedResult.key}</div>
						{/if}
						<div class="flex items-center gap-2 truncate">
							<strong>URL:</strong>
							<a
								href={uploadedResult.url}
								target="_blank"
								rel="external"
								class="inline-flex items-center gap-1 truncate text-primary hover:underline"
							>
								<span class="truncate">{uploadedResult.url}</span>
								<ExternalLink class="size-3 shrink-0" />
							</a>
						</div>
					</div>
				</div>
			{/if}

			<!-- Error Notice -->
			{#if uploader.error}
				<div class="space-y-1 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
					<div class="flex items-center gap-2 text-xs font-bold text-destructive">
						<XCircle class="size-4" />
						<span>Storage Configuration Required</span>
					</div>
					<p class="text-xs text-muted-foreground">{uploader.error}</p>
					<p class="font-mono text-[11px] text-muted-foreground">
						Set <code>S3_BUCKET</code>, <code>S3_ACCESS_KEY_ID</code>, and
						<code>S3_SECRET_ACCESS_KEY</code>
						in <code>.env</code>.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
