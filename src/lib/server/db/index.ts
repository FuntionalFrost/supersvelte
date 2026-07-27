import { env } from '$env/dynamic/private';
import { DATABASE_URL } from '$env/static/private';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Connection pooling optimized for Node.js serverless Lambdas
const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });
