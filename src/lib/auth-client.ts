// src/lib/auth-client.ts
import { adminClient, organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
	plugins: [adminClient(), organizationClient()]
});

export const { signIn, signUp, signOut, useSession, useActiveOrganization } = authClient;
