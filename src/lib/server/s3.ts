// src/lib/server/s3.ts
import { env } from '$env/dynamic/private';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucket = env.S3_BUCKET || env.R2_BUCKET || '';
const region = env.S3_REGION || env.R2_REGION || 'auto';
const endpoint = env.S3_ENDPOINT || env.R2_ENDPOINT || undefined;
const accessKeyId = env.S3_ACCESS_KEY_ID || env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = env.S3_SECRET_ACCESS_KEY || env.R2_SECRET_ACCESS_KEY || '';
const publicDomain = env.S3_PUBLIC_DOMAIN || env.R2_PUBLIC_DOMAIN || '';

export function isS3Configured(): boolean {
	return Boolean(bucket && accessKeyId && secretAccessKey);
}

function getS3Client(): S3Client {
	return new S3Client({
		region,
		endpoint,
		credentials: {
			accessKeyId,
			secretAccessKey
		}
	});
}

export interface PresignedUploadOptions {
	key: string;
	contentType?: string;
	expiresIn?: number; // in seconds (default 300 = 5 min)
}

/**
 * Generate a direct presigned PUT URL for browser uploads
 */
export async function getPresignedUploadUrl({
	key,
	contentType = 'application/octet-stream',
	expiresIn = 300
}: PresignedUploadOptions) {
	if (!isS3Configured()) {
		throw new Error(
			'S3 / Cloudflare R2 is not configured. Please set S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY in .env'
		);
	}

	const client = getS3Client();
	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: key,
		ContentType: contentType
	});

	const uploadUrl = await getSignedUrl(client, command, { expiresIn });

	// Compute public view URL if configured, otherwise fallback to endpoint/bucket
	const fileUrl = publicDomain
		? `${publicDomain.replace(/\/$/, '')}/${key}`
		: endpoint
			? `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`
			: `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

	return {
		uploadUrl,
		fileUrl,
		key,
		expiresIn
	};
}

/**
 * Generate a presigned GET URL for private file access
 */
export async function getPresignedDownloadUrl({
	key,
	expiresIn = 3600
}: {
	key: string;
	expiresIn?: number;
}) {
	if (!isS3Configured()) {
		throw new Error('S3 / Cloudflare R2 is not configured.');
	}

	const client = getS3Client();
	const command = new GetObjectCommand({
		Bucket: bucket,
		Key: key
	});

	return await getSignedUrl(client, command, { expiresIn });
}

/**
 * Delete an object from S3 / R2
 */
export async function deleteS3Object({ key }: { key: string }) {
	if (!isS3Configured()) {
		throw new Error('S3 / Cloudflare R2 is not configured.');
	}

	const client = getS3Client();
	const command = new DeleteObjectCommand({
		Bucket: bucket,
		Key: key
	});

	return await client.send(command);
}
