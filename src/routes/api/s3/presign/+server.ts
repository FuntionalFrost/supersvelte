// src/routes/api/s3/presign/+server.ts
import { getPresignedUploadUrl, isS3Configured } from '$lib/server/s3';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	// Guard: check if S3/R2 is configured
	if (!isS3Configured()) {
		error(503, {
			message: 'S3 / Cloudflare R2 is not configured in .env'
		});
	}

	const body = await request.json().catch(() => ({}));
	const filename = (body.filename as string) || 'upload';
	const contentType = (body.contentType as string) || 'application/octet-stream';
	const prefix = (body.prefix as string) || 'uploads';

	// Sanitize file extension and build unique key
	const ext = filename.includes('.') ? filename.split('.').pop() : '';
	const uniqueId = crypto.randomUUID();
	const key = `${prefix}/${uniqueId}${ext ? `.${ext}` : ''}`;

	try {
		const presigned = await getPresignedUploadUrl({
			key,
			contentType,
			expiresIn: 300 // 5 minutes
		});

		return json({
			...presigned,
			publicUrl: presigned.fileUrl,
			url: presigned.fileUrl,
			filename
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to generate presigned upload URL';
		error(500, { message });
	}
};
