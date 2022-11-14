import { useSession } from 'next-auth/react';
import { createContext, PropsWithChildren, useContext } from 'react';
import { IAuthProviderContext } from '../../types/contexts';

const useProvideAuth = () => {
	const session = useSession();
	const token = session?.data?.token;
	const user = session?.data?.user;
	const role = session?.data?.user?.role;
	const isAuthenticated = session.status === 'authenticated';
	const isLoading = session.status === 'loading';

	return { token, user, isAuthenticated, isLoading, role };
};

const AuthContext = createContext<IAuthProviderContext>({} as IAuthProviderContext);

export function AuthProvider({ children }: PropsWithChildren) {
	const state = useProvideAuth();

	return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
	return useContext(AuthContext);
}
