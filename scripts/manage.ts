// scripts/manage.ts
import 'dotenv/config';
import * as p from '@clack/prompts';
import { neon } from '@neondatabase/serverless';
import { hashPassword } from 'better-auth/crypto';
import { count, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import crypto from 'node:crypto';
import * as schema from '../src/lib/server/db/schema.js';

const [commandArg, ...args] = process.argv.slice(2);

function getDb() {
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not defined in .env');
	}
	const sql = neon(process.env.DATABASE_URL);
	return drizzle(sql, { schema });
}

async function promptText(
	message: string,
	placeholder: string,
	validate?: (val: string | undefined) => string | undefined
): Promise<string | null> {
	const value = await p.text({ message, placeholder, validate });
	if (p.isCancel(value)) {
		p.cancel('Operation cancelled.');
		return null;
	}
	return value;
}

async function runCreateSuperuser(
	initialName?: string,
	initialEmail?: string,
	initialPass?: string
) {
	p.intro('SuperSvelte - Create Superuser');

	const name =
		initialName ||
		(await promptText('Enter admin name:', 'Admin', (val) =>
			!val ? 'Name is required' : undefined
		));
	if (!name) return;

	const email =
		initialEmail ||
		(await promptText('Enter admin email:', 'admin@example.com', (val) =>
			!val || !val.includes('@') ? 'Valid email is required' : undefined
		));
	if (!email) return;

	let password = initialPass;
	if (!password) {
		const prompted = await p.password({
			message: 'Enter admin password (min 8 chars):',
			validate: (val) =>
				!val || val.length < 8 ? 'Password must be at least 8 characters' : undefined
		});
		if (p.isCancel(prompted)) {
			p.cancel('Operation cancelled.');
			return;
		}
		password = prompted;
	}

	const spinner = p.spinner();
	spinner.start('Creating superuser account...');

	const db = getDb();
	const [existing] = await db
		.select()
		.from(schema.user)
		.where(eq(schema.user.email, email))
		.limit(1);

	if (existing) {
		spinner.stop('User already exists');
		p.log.error(`A user with email "${email}" already exists. Use "make:admin" to promote them.`);
		return;
	}

	const userId = crypto.randomUUID();
	const accountId = crypto.randomUUID();
	const passwordHash = await hashPassword(password);

	await db.insert(schema.user).values({
		id: userId,
		name,
		email,
		role: 'admin',
		emailVerified: true
	});

	await db.insert(schema.account).values({
		id: accountId,
		accountId: userId,
		providerId: 'credential',
		userId,
		password: passwordHash
	});

	spinner.stop('Superuser created!');
	p.note(`Email: ${email}\nRole:  admin\nLogin: http://localhost:5173/login`, 'Admin Credentials');
	p.outro('You can now sign in and visit /admin.');
}

async function runMakeAdmin(initialEmail?: string) {
	const email =
		initialEmail ||
		(await promptText('Enter user email to promote to admin:', 'user@example.com', (val) =>
			!val || !val.includes('@') ? 'Valid email is required' : undefined
		));
	if (!email) return;

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
}

async function runMakeLicense(initialEmail?: string, initialTier?: string) {
	const email =
		initialEmail ||
		(await promptText('Enter user email for license:', 'user@example.com', (val) =>
			!val || !val.includes('@') ? 'Valid email is required' : undefined
		));
	if (!email) return;

	let tier = initialTier?.toLowerCase();
	if (!tier) {
		const selected = await p.select({
			message: 'Select license tier:',
			options: [
				{ label: 'Pro', value: 'pro' },
				{ label: 'Standard', value: 'standard' }
			]
		});
		if (p.isCancel(selected)) {
			p.cancel('Operation cancelled.');
			return;
		}
		tier = selected;
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
}

async function runStats() {
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
}

function printHelp() {
	console.log(`
⚡ SuperSvelte Management CLI (like Django manage.py)

Usage:
  pnpm manage [command] [arguments]

Available Commands:
  createsuperuser [name] [email] [pw]  Create a new admin user with password
  make:admin [email]                   Promote an existing user account to admin
  make:license [email] [pro|standard]  Generate manual active license key for user
  stats                                Display database metrics & counts
`);
}

async function main() {
	let command = commandArg;

	if (!command) {
		p.intro('⚡ SuperSvelte Management CLI');
		const selected = await p.select({
			message: 'Choose a management command:',
			options: [
				{ label: 'createsuperuser — Create a new admin user', value: 'createsuperuser' },
				{ label: 'make:admin — Promote an existing user to admin', value: 'make:admin' },
				{ label: 'make:license — Generate a manual license key', value: 'make:license' },
				{ label: 'stats — Display database metrics & counts', value: 'stats' },
				{ label: 'help — Show CLI usage', value: 'help' }
			]
		});
		if (p.isCancel(selected)) {
			p.cancel('Operation cancelled.');
			return;
		}
		command = selected;
	}

	switch (command) {
		case 'createsuperuser':
			await runCreateSuperuser(args[0], args[1], args[2]);
			break;
		case 'make:admin':
			await runMakeAdmin(args[0]);
			break;
		case 'make:license':
			await runMakeLicense(args[0], args[1]);
			break;
		case 'stats':
			await runStats();
			break;
		default:
			printHelp();
			break;
	}
}

main().catch((err) => {
	console.error('Fatal CLI Error:', err);
	process.exit(1);
});
