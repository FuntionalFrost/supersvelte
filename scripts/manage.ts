// scripts/manage.ts
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/server/db/schema.js';
import { count, eq } from 'drizzle-orm';

const [command, ...args] = process.argv.slice(2);

function getDb() {
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not defined in .env');
	}
	const sql = neon(process.env.DATABASE_URL);
	return drizzle(sql, { schema });
}

async function main() {
	switch (command) {
		case 'make:admin': {
			const email = args[0];
			if (!email) {
				console.error(
					'❌ Error: Please provide an email. Example: pnpm manage make:admin test@example.com'
				);
				process.exit(1);
			}

			const db = getDb();
			const [matched] = await db
				.select()
				.from(schema.user)
				.where(eq(schema.user.email, email))
				.limit(1);

			if (!matched) {
				console.error(`❌ Error: User with email "${email}" not found.`);
				process.exit(1);
			}

			await db.update(schema.user).set({ role: 'admin' }).where(eq(schema.user.id, matched.id));
			console.log(`✅ Success: User "${email}" (${matched.id}) promoted to role "admin".`);
			break;
		}

		case 'make:license': {
			const email = args[0];
			const tier = (args[1] || 'pro').toLowerCase();

			if (!email) {
				console.error(
					'❌ Error: Please provide an email. Example: pnpm manage make:license user@example.com pro'
				);
				process.exit(1);
			}

			const db = getDb();
			const [matched] = await db
				.select()
				.from(schema.user)
				.where(eq(schema.user.email, email))
				.limit(1);

			if (!matched) {
				console.error(`❌ Error: User with email "${email}" not found in database.`);
				process.exit(1);
			}

			const licenseKey = schema.generateLicenseKey();
			const txnId = `manual_${Date.now()}`;
			const custId = `cust_${Date.now()}`;
			const productId =
				tier === 'pro'
					? process.env.PUBLIC_POLAR_PRO_PRODUCT_ID || 'pro'
					: process.env.PUBLIC_POLAR_STANDARD_PRODUCT_ID || 'standard';

			await db.insert(schema.customers).values({
				customerId: custId,
				userId: matched.id,
				email
			});

			await db.insert(schema.purchases).values({
				transactionId: txnId,
				customerId: custId,
				userId: matched.id,
				productId,
				licenseKey,
				status: 'active'
			});

			console.log(`✅ Success: Generated ${tier.toUpperCase()} license for "${email}":`);
			console.log(`   🔑 License Key: ${licenseKey}`);
			console.log(`   📦 Product ID:  ${productId}`);
			console.log(`   🆔 Txn ID:      ${txnId}`);
			break;
		}

		case 'stats': {
			const db = getDb();
			console.log('\n📊 SuperSvelte Platform Metrics\n' + '─'.repeat(35));
			const [{ count: userCount }] = await db.select({ count: count() }).from(schema.user);
			const [{ count: purchaseCount }] = await db.select({ count: count() }).from(schema.purchases);
			const [{ count: projectCount }] = await db.select({ count: count() }).from(schema.projects);
			const [{ count: orgCount }] = await db.select({ count: count() }).from(schema.organization);

			console.log(` 👥 Total Users:         ${userCount}`);
			console.log(` 💎 Active Purchases:    ${purchaseCount}`);
			console.log(` 📁 Projects Created:    ${projectCount}`);
			console.log(` 🏢 Organizations/Teams: ${orgCount}`);
			console.log('─'.repeat(35) + '\n');
			break;
		}

		case 'package':
		case 'package:zip': {
			console.log('📦 Packaging SuperSvelte boilerplate for distribution...');
			const privateDir = path.resolve('private');
			if (!fs.existsSync(privateDir)) {
				fs.mkdirSync(privateDir, { recursive: true });
			}

			const outPath = path.join(privateDir, 'supersvelte-latest.zip');
			execSync(`git archive --format=zip -o "${outPath}" HEAD`);
			const stats = fs.statSync(outPath);
			console.log(`✅ Done! Created "${outPath}" (${Math.round(stats.size / 1024)} KB).`);
			console.log(`   Ready to be served by /api/download.`);
			break;
		}

		default: {
			console.log(`
⚡ SuperSvelte Management CLI (like Django manage.py)

Usage:
  pnpm manage <command> [arguments]

Available Commands:
  make:admin <email>              Promote user account to admin
  make:license <email> [pro|std]  Generate manual active license key for user
  stats                           Display database metrics & counts
  package                         Create clean distribution ZIP in private/
`);
			break;
		}
	}
}

main().catch((err) => {
	console.error('Fatal CLI Error:', err);
	process.exit(1);
});
