// src/routes/api/[...paths]/+server.ts
import { app } from '$lib/server/api'; // 👈 Destructure named import

export const fallback = ({ request }) => app.fetch(request);
