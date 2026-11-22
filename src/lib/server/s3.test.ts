// src/lib/server/s3.test.ts
import { describe, expect, it } from 'vitest';
import { ensureS3Bucket, isS3Configured, listS3Objects } from './s3';

describe('S3 / Cloudflare R2 Storage Helper', () => {
	it('checks if S3 credentials are configured', () => {
		// In default test environment without S3 env vars, returns false or boolean
		const configured = isS3Configured();
		expect(typeof configured).toBe('boolean');
	});

	it('safely handles ensureS3Bucket and listS3Objects when S3 is not configured', async () => {
		if (!isS3Configured()) {
			await expect(ensureS3Bucket()).resolves.toBe(false);
			await expect(listS3Objects()).resolves.toEqual([]);
		}
	});
});
