import { Role } from '@prisma/client';
import { User } from 'next-auth';

export interface IAuthProviderContext {
	user?: User;
	isLoading: boolean;
	isAuthenticated: boolean;
	token?: string;
	role?: Role;
}

export interface IProvider {
	children: React.ReactNode;
}
