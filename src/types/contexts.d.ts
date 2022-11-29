import { Role } from '@prisma/client';
import { Session } from 'next-auth';

export interface IAuthProviderContext {
	user?: Session.user;
	isLoading: boolean;
	isAuthenticated: boolean;
	role?: Role;
	schoolId?: string;
}

export interface IProvider {
	children: React.ReactNode;
}
