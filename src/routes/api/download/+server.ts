// src/routes/api/download/+server.ts
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';

export const GET: RequestHandler = async ({ locals }) => {
	// 1. Verify user is logged in
	if (!locals.user) {
		throw error(401, 'Unauthorized. Please sign in to download source code.');
	}

	// 2. Verify active purchase directly in Neon SQL
	const [activePurchase] = await db
		.select()
		.from(purchases)
		.where(and(eq(purchases.userId, locals.user.id), eq(purchases.status, 'active')))
		.limit(1);

	if (!activePurchase) {
		throw error(403, 'No active license found. Purchase a license to unlock downloads.');
	}

	// 3. Resolve private archive file location
	const zipPath = path.resolve('private/supersvelte-latest.zip');

	if (!fs.existsSync(zipPath)) {
		// Fallback: If local file storage isn't populated, redirect to secure S3/UploadThing URL
		const signedCloudUrl = env.SOURCE_CODE_ZIP_URL;
		if (signedCloudUrl) {
			return Response.redirect(signedCloudUrl, 302);
		}
		throw error(404, 'Source archive package is currently updating. Please try again shortly.');
	}

	// 4. Convert Node ReadStream to standard Web ReadableStream
	const fileStream = fs.createReadStream(zipPath);
	const webStream = Readable.toWeb(fileStream);
	const stat = fs.statSync(zipPath);

	return new Response(webStream as ReadableStream, {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': 'attachment; filename="supersvelte-boilerplate.zip"',
			'Content-Length': stat.size.toString(),
			'Cache-Control': 'private, no-transform, no-store'
		}
	});
};
