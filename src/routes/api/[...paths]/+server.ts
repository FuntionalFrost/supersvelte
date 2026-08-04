// src/routes/api/[...path]/+server.ts
import { app } from '$lib/server/api';
import type { RequestHandler } from './$types';

// Catch all HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD)
export const fallback: RequestHandler = ({ request }) => app.fetch(request);
