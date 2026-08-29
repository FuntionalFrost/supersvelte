<script lang="ts">
	import { CloudUpload, FileText, Upload } from '@lucide/svelte';

	let { onFileCountUpdate } = $props<{ onFileCountUpdate?: (count: number) => void }>();

	let isUploading = $state(false);
	let uploadProgress = $state(0);
	let uploadedFiles = $state<Array<{ name: string; size: string; url: string; time: string }>>([]);
	let fileInputRef = $state<HTMLInputElement | null>(null);

	async function handleFileUpload(files: FileList | null) {
		if (!files || files.length === 0) return;
		const file = files[0];

		isUploading = true;
		uploadProgress = 10;

		const progressInterval = setInterval(() => {
			uploadProgress = Math.min(uploadProgress + 20, 90);
		}, 150);

		try {
			const formData = new FormData();
			formData.append('file', file);

			const res = await fetch('/api/uploadthing', { method: 'POST', body: formData });
			clearInterval(progressInterval);
			uploadProgress = 100;

			const responseData = res.ok ? await res.json() : null;
			const fileUrl = responseData?.url || URL.createObjectURL(file);

			uploadedFiles = [
				{
					name: file.name,
					size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
					url: fileUrl,
					time: new Date().toLocaleTimeString()
				},
				...uploadedFiles
			];
			onFileCountUpdate?.(uploadedFiles.length);
		} catch (err) {
			console.error('Upload failed:', err);
		} finally {
			setTimeout(() => {
				isUploading = false;
				uploadProgress = 0;
			}, 400);
		}
	}
</script>

<div class="grid gap-6 md:grid-cols-3">
	<div class="space-y-4 rounded-xl border border-border bg-card p-6">
		<div class="flex items-center gap-2 text-sm font-bold">
			<CloudUpload class="size-4 text-pink-400" />
			<span>UploadThing Storage</span>
		</div>
		<p class="text-xs leading-relaxed text-muted-foreground">
			Direct-to-cloud file uploads with S3 storage and type-safe server responses.
		</p>

		<div
			onclick={() => fileInputRef?.click()}
			onkeydown={(e) => e.key === 'Enter' && fileInputRef?.click()}
			role="button"
			tabindex="0"
			class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 p-6 text-center transition hover:border-primary/50 hover:bg-primary/5"
		>
			<Upload class="size-8 text-muted-foreground" />
			<div class="text-xs font-semibold">Click or drag file to upload</div>
			<div class="text-[10px] text-muted-foreground">Images, PDFs, or Documents up to 16MB</div>
		</div>

		<input
			type="file"
			bind:this={fileInputRef}
			onchange={(e) => handleFileUpload((e.target as HTMLInputElement).files)}
			class="hidden"
		/>

		{#if isUploading}
			<div class="space-y-1.5">
				<div class="flex justify-between text-[11px] font-semibold">
					<span>Uploading to cloud...</span>
					<span class="font-mono">{uploadProgress}%</span>
				</div>
				<div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
					<div
						class="h-full bg-primary transition-all duration-200"
						style="width: {uploadProgress}%;"
					></div>
				</div>
			</div>
		{/if}
	</div>

	<div class="rounded-xl border border-border bg-card p-6 md:col-span-2">
		<div class="flex items-center justify-between border-b border-border pb-3">
			<div class="flex items-center gap-2 text-xs font-bold">
				<FileText class="size-4 text-pink-400" />
				<span>Cloud Upload Log ({uploadedFiles.length})</span>
			</div>
			<span class="font-mono text-[11px] text-muted-foreground">S3 Storage Ready</span>
		</div>

		<div class="mt-4 space-y-2">
			{#if uploadedFiles.length === 0}
				<div class="py-12 text-center text-xs text-muted-foreground">
					No files uploaded yet. Click the dropzone to test UploadThing!
				</div>
			{:else}
				{#each uploadedFiles as f (f.name + f.time)}
					<div
						class="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 p-3 text-xs"
					>
						<div class="flex items-center gap-3">
							<FileText class="size-4 shrink-0 text-primary" />
							<div class="space-y-0.5">
								<div class="font-semibold text-foreground">{f.name}</div>
								<div class="font-mono text-[10px] text-muted-foreground">{f.size} • {f.time}</div>
							</div>
						</div>
						<a
							href={f.url}
							target="_blank"
							rel="external"
							class="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[10px] font-semibold text-primary hover:bg-accent"
						>
							View File
						</a>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
