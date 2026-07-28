// src/lib/uploadthing.ts
import type { OurFileRouter } from '$lib/server/uploadthing';
import { generateSvelteHelpers } from '@uploadthing/svelte';

export const { createUploadThing, createUploader, uploadFiles } =
	generateSvelteHelpers<OurFileRouter>();
