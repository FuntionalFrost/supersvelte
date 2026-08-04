// src/routes/api/[...path]/+server.ts
import { app } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';

// 🔑 Declare handler function passing SvelteKit requests to Hono
const handler: RequestHandler = ({ request }) => app.fetch(request);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
