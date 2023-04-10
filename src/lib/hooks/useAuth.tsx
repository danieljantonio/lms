import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { createContext, PropsWithChildren, useContext } from 'react';
import { IAuthProviderContext } from '@/types/contexts';

const useProvideAuth = () => {
	const _user: User = {
		id: '',
		name: null,
		username: '',
		schoolId: null,
		password: '',
		role: 'STUDENT',
	};
	const session = useSession();
	const user: User = session?.data?.user || _user;
	const role = session?.data?.user?.role;
	const isAuthenticated = session.status === 'authenticated';
	const isLoading = session.status === 'loading';

	return { user, isAuthenticated, isLoading, role };
};

const AuthContext = createContext<IAuthProviderContext>(
	{} as IAuthProviderContext,
);

export function AuthProvider({ children }: PropsWithChildren) {
	const state = useProvideAuth();

	return (
		<AuthContext.Provider value={state}>{children}</AuthContext.Provider>
	);
}

export default function useAuth() {
	return useContext(AuthContext);
}
