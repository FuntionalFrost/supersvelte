// src/routes/api/og/+server.ts
import { createOgImageHandler } from 'yaxa-svelte/seo';
import { siteConfig } from '../../../site.config.js';

export const prerender = false;

export const GET = createOgImageHandler({ config: siteConfig });
