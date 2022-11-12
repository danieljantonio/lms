export interface IAuthProviderContext {
	user?: IUser;
	isLoading: boolean;
	isAuthenticated: boolean;
	token?: string;
}
export interface IProvider {
	children: React.ReactNode;
}

export interface IUser {
	id: string;
	email: string;
	name: string;
	role: Roles;
}

enum Roles {
	SUPERADMIN,
	ADMIN,
	PRINCIPAL,
	TEACHER,
	STUDENT,
}
