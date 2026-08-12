// src/routes/api/download/+server.ts
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import fs from 'node:fs';
import path from 'node:path';

export const GET: RequestHandler = async ({ locals }) => {
	// 1. Verify user is logged in
	if (!locals.user) {
		throw error(401, 'Unauthorized. Please sign in to download source code.');
	}

	// 2. Verify active purchase in Neon DB
	const userPurchases = await db
		.select()
		.from(purchases)
		.where(eq(purchases.userId, locals.user.id));

	const activePurchase = userPurchases.find((p) => p.status === 'active');

	if (!activePurchase) {
		throw error(403, 'No active license found. Purchase a license to unlock downloads.');
	}

	// 3. Resolve private archive file location
	const zipPath = path.resolve('private/supersvelte-latest.zip');

	if (!fs.existsSync(zipPath)) {
		// Fallback: If local file storage isn't populated, redirect to secure S3/UploadThing URL
		const signedCloudUrl = process.env.SOURCE_CODE_ZIP_URL;
		if (signedCloudUrl) {
			return Response.redirect(signedCloudUrl, 302);
		}
		throw error(404, 'Source archive package is currently updating. Please try again shortly.');
	}

	// 4. Stream .zip archive to buyer
	const fileStream = fs.createReadStream(zipPath);
	const stat = fs.statSync(zipPath);

	return new Response(fileStream as unknown as ReadableStream, {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': 'attachment; filename="supersvelte-boilerplate.zip"',
			'Content-Length': stat.size.toString(),
			'Cache-Control': 'private, no-transform, no-store'
		}
	});
};
