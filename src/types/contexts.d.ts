import { Role, User } from '@prisma/client';

export interface IAuthProviderContext {
	user?: User;
	isLoading: boolean;
	isAuthenticated: boolean;
	role?: Role;
}

export interface IProvider {
	children: React.ReactNode;
}
