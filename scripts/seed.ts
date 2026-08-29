import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { seed } from 'drizzle-seed';
import * as schema from '../src/lib/server/db/schema';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
	console.log('🌱 Starting database seed...');

	await seed(db, schema).refine((funcs) => ({
		user: {
			count: 20,
			columns: {
				name: funcs.fullName(),
				email: funcs.email()
			}
		}
	}));

	console.log('👤 Seeding default admin user...');
	await db
		.insert(schema.user)
		.values({
			id: 'admin-test-id',
			name: 'Admin Tester',
			email: 'admin@example.com',
			emailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date()
		})
		.onConflictDoNothing();

	console.log('✅ Database seeded successfully!');
	process.exit(0);
}

main().catch((err) => {
	console.error('❌ Seeding failed:', err);
	process.exit(1);
});
