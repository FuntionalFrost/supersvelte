import { building } from '$app/env';
import { DATABASE_URL } from '$app/env/private';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

const connectionString =
	DATABASE_URL || (building ? 'postgresql://dummy:dummy@localhost:5432/dummy' : '');

if (!connectionString) throw new Error('DATABASE_URL is not set');

// Connection pooling optimized for Node.js serverless Lambdas
const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
