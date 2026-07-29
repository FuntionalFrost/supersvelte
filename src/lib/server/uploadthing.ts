// src/lib/server/uploadthing.ts
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { files } from '$lib/server/db/schema';
import { redis } from '$lib/server/ratelimit';
import { createUploadthing, type FileRouter } from 'uploadthing/server';

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({ image: { maxFileSize: '4MB' } })
		.middleware(async ({ req }) => {
			const session = await auth.api.getSession({ headers: req.headers });
			if (!session) throw new Error('Unauthorized');
			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// 1. Save file reference to Neon via Drizzle
			const [insertedFile] = await db
				.insert(files)
				.values({
					url: file.ufsUrl,
					key: file.key,
					name: file.name,
					size: file.size,
					userId: metadata.userId
				})
				.returning();

			// 2. 📣 Optional: Broadcast event to Realtime SSE listeners via Upstash
			if (redis) {
				await redis.lpush(
					'events:app',
					JSON.stringify({
						type: 'FILE_UPLOADED',
						payload: insertedFile,
						timestamp: new Date().toISOString()
					})
				);
			}

			return { url: file.ufsUrl, fileId: insertedFile.id };
		})
} satisfies FileRouter;
