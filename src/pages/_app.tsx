import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { trpc } from '../lib/trpc';

import '../styles/globals.css';
import { AuthProvider } from '../lib/hooks/useAuth';
import AuthLayout from '../components/layouts/auth.layout';
import { ThemeProvider } from 'next-themes';

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<SessionProvider session={session}>
			<AuthProvider>
				<AuthLayout>
					<ThemeProvider enableSystem={true} attribute="data-theme" themes={['cupcake', 'dark']}>
						<Component {...pageProps} />
					</ThemeProvider>
				</AuthLayout>
			</AuthProvider>
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);
