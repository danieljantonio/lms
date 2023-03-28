import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { trpc } from '../lib/trpc';

import '../styles/globals.css';
import { AuthProvider } from '../lib/hooks/useAuth';
import AuthLayout from '../components/layouts/auth.layout';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<Head>
				<title>
					Ignosi - A simpler and more efficient learning platform
				</title>
				<meta
					name="description"
					content="Ignosi is a learning platform that provides a more simple and efficient learning experience for both students and teachers alike."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<AuthProvider>
				<AuthLayout>
					<ThemeProvider
						enableSystem={true}
						attribute="data-theme"
						themes={['cupcake', 'dark']}>
						<main className=""></main>
						<Component {...pageProps} />
					</ThemeProvider>
				</AuthLayout>
			</AuthProvider>
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);
