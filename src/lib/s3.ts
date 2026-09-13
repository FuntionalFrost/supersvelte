// src/lib/s3.ts

export interface UploadToS3Options {
	prefix?: string;
	onProgress?: (percentage: number) => void;
}

export interface UploadToS3Result {
	key: string;
	fileUrl: string;
	filename: string;
}

/**
 * Direct browser upload to S3 / Cloudflare R2 using presigned PUT URL
 */
export async function uploadToS3(
	file: File,
	options: UploadToS3Options = {}
): Promise<UploadToS3Result> {
	// 1. Request presigned URL from backend
	const presignRes = await fetch('/api/s3/presign', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			filename: file.name,
			contentType: file.type || 'application/octet-stream',
			prefix: options.prefix || 'uploads'
		})
	});

	if (!presignRes.ok) {
		const errData = await presignRes.json().catch(() => ({}));
		throw new Error(errData.message || 'Failed to obtain presigned upload URL');
	}

	const { uploadUrl, fileUrl, key } = await presignRes.json();

	// 2. Perform direct PUT upload with XMLHttpRequest to track progress
	await new Promise<void>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', uploadUrl, true);
		xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

		if (options.onProgress) {
			xhr.upload.onprogress = (e) => {
				if (e.lengthComputable) {
					const pct = Math.round((e.loaded / e.total) * 100);
					options.onProgress?.(pct);
				}
			};
		}

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve();
			} else {
				reject(new Error(`S3 upload failed with status ${xhr.status}: ${xhr.statusText}`));
			}
		};

		xhr.onerror = () => reject(new Error('Network error during S3 direct upload.'));
		xhr.send(file);
	});

	return {
		key,
		fileUrl,
		filename: file.name
	};
}
