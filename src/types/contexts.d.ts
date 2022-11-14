import { User } from 'next-auth';

export interface IAuthProviderContext {
	user?: User;
	isLoading: boolean;
	isAuthenticated: boolean;
	token?: string;
}

export interface IProvider {
	children: React.ReactNode;
}
