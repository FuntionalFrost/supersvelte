// src/lib/server/uploadthing.ts
import { auth } from '$lib/server/auth';
import { createUploadthing, type FileRouter } from 'uploadthing/server';

const f = createUploadthing();

export const ourFileRouter = {
	// Define an image uploader endpoint
	imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(async ({ req }) => {
			// Authenticate request via Better Auth
			const session = await auth.api.getSession({ headers: req.headers });

			// If not logged in, throw error
			if (!session) throw new Error('Unauthorized');

			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete for userId:', metadata.userId);
			console.log('File CDN URL:', file.ufsUrl);
			return { uploadedBy: metadata.userId, url: file.ufsUrl };
		})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
