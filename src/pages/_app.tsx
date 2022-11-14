import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { trpc } from '../lib/trpc';

import '../styles/globals.css';
import { AuthProvider } from '../lib/hooks/useAuth';
import GlobalLayout from '../components/layouts/global.layout';

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<SessionProvider session={session}>
			<AuthProvider>
				<GlobalLayout>
					<Component {...pageProps} />
				</GlobalLayout>
			</AuthProvider>
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);
