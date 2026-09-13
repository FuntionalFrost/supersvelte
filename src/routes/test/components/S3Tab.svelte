<!-- src/routes/test/components/S3Tab.svelte -->
<script lang="ts">
	import { uploadToS3 } from '$lib/s3';
	import { CheckCircle2, Cloud, ExternalLink, HardDrive, Upload, XCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let fileInput = $state<HTMLInputElement | null>(null);
	let isUploading = $state(false);
	let uploadProgress = $state<number>(0);
	let uploadedResult = $state<{ key: string; fileUrl: string; filename: string } | null>(null);
	let errorMessage = $state<string | null>(null);

	async function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		isUploading = true;
		uploadProgress = 0;
		errorMessage = null;
		uploadedResult = null;

		try {
			const result = await uploadToS3(file, {
				prefix: 'test-uploads',
				onProgress: (pct) => {
					uploadProgress = pct;
				}
			});

			uploadedResult = result;
			toast.success(`Uploaded ${file.name} successfully to S3/R2!`);
		} catch (err: unknown) {
			errorMessage = err instanceof Error ? err.message : 'Upload failed';
			toast.error(errorMessage);
		} finally {
			isUploading = false;
			if (fileInput) fileInput.value = '';
		}
	}
</script>

<div class="space-y-6">
	<div class="rounded-2xl border border-border bg-card p-6 shadow-xs">
		<div class="flex items-center gap-3 border-b border-border pb-4">
			<div class="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
				<HardDrive class="size-5" />
			</div>
			<div>
				<h2 class="text-base font-bold">Cloudflare R2 / AWS S3 Direct Presigned Uploads</h2>
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
					Generates a 5-minute presigned PUT URL via <code>/api/s3/presign</code> and streams binary data.
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
					disabled={isUploading}
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50"
				>
					<Upload class="size-3.5" />
					<span>{isUploading ? `Uploading (${uploadProgress}%)...` : 'Choose File'}</span>
				</button>
			</div>

			<!-- Progress Bar -->
			{#if isUploading}
				<div class="space-y-1.5 rounded-xl border border-border bg-muted/20 p-4">
					<div class="flex justify-between text-xs font-semibold">
						<span>Streaming to S3/R2 Bucket...</span>
						<span class="font-mono">{uploadProgress}%</span>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-muted">
						<div
							class="h-full bg-primary transition-all duration-150"
							style="width: {uploadProgress}%"
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
						<div><strong>Key:</strong> {uploadedResult.key}</div>
						<div class="flex items-center gap-2 truncate">
							<strong>URL:</strong>
							<a
								href={uploadedResult.fileUrl}
								target="_blank"
								rel="external"
								class="inline-flex items-center gap-1 truncate text-primary hover:underline"
							>
								<span class="truncate">{uploadedResult.fileUrl}</span>
								<ExternalLink class="size-3 shrink-0" />
							</a>
						</div>
					</div>
				</div>
			{/if}

			<!-- Error Notice -->
			{#if errorMessage}
				<div class="space-y-1 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
					<div class="flex items-center gap-2 text-xs font-bold text-destructive">
						<XCircle class="size-4" />
						<span>Storage Configuration Required</span>
					</div>
					<p class="text-xs text-muted-foreground">{errorMessage}</p>
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
