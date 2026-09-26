// src/routes/admin/+page.server.ts
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { createDrizzleAdmin } from 'yaxa-svelte/admin';

export const { load, actions } = createDrizzleAdmin({ db, schema });
