// src/routes/api/[...paths]/+server.ts
import { app } from '$lib/server/api'; // Destructure named import

// SvelteKit fallback handler forwards all HTTP verbs (GET, POST, PUT, DELETE, etc.) to Hono
export const fallback = ({ request }) => app.fetch(request);
