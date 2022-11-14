import { type DefaultSession } from 'next-auth';
import { Roles } from './contexts';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		token?: string;
		user?: {
			id: string;
			name: string;
			email: string;
			role: Roles;
			school: string; //TODO: change this to the appropriate type once it is set up
			schoolId: string; //TODO: change this to the appropriate type once it is set up
		} & DefaultSession['user'];
	}
}
