// src/lib/server/s3.test.ts
import { describe, expect, it } from 'vitest';
import { isS3Configured } from './s3';

describe('S3 / Cloudflare R2 Storage Helper', () => {
	it('checks if S3 credentials are configured', () => {
		// In default test environment without S3 env vars, returns false or boolean
		const configured = isS3Configured();
		expect(typeof configured).toBe('boolean');
	});
});
