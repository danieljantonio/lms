import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { trpc } from '../lib/trpc';

import '../styles/globals.css';
import useAuth, { AuthProvider } from '../lib/hooks/useAuth';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren } from 'react';
import TeacherLayout from '../components/layouts/teacher.layout';

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<SessionProvider session={session}>
			<AuthProvider>
				<CustomRouter>
					<Component {...pageProps} />
				</CustomRouter>
			</AuthProvider>
		</SessionProvider>
	);
};

const CustomRouter: FC<PropsWithChildren> = ({ children }) => {
	const { isAuthenticated, isLoading, user } = useAuth();

	const router = useRouter();
	const basePath = router.pathname.split('/')[1];

	switch (basePath) {
		case 'admin':
			return <div id="admin-layout">{children}</div>;
		case 'teacher':
			return <TeacherLayout>{children}</TeacherLayout>;
		default:
			return <div>{children}</div>;
	}
};

export default trpc.withTRPC(MyApp);
