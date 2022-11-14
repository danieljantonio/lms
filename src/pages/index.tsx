import { type NextPage } from 'next';
import Head from 'next/head';
import { signIn, signOut, useSession } from 'next-auth/react';
import { trpc } from '../lib/trpc';
import Link from 'next/link';
import useAuth from '../lib/hooks/useAuth';
import { Button } from 'flowbite-react';

const Home: NextPage = () => {
	const { isAuthenticated, user } = useAuth();

	return (
		<>
			<Head>
				<title>Create T3 App</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{/* <AuthShowcase /> */}
			{/* <div className="mx-auto mt-5 w-56 rounded-lg border py-5 px-10">
				<label htmlFor="schoolCode" className="mb-2 block text-sm font-medium text-gray-900">
					Enter school code
				</label>
				<input
					type="text"
					id="schoolCode"
					className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					placeholder="School Code"
					required
				/>
			</div> */}
			<div className="my-10 flex flex-col items-center justify-center gap-4">
				<p className="mb-2 text-4xl">Welcome To Ignosis{isAuthenticated ? `, ${user?.name}` : ''}</p>

				{isAuthenticated ? (
					<>
						<Link href="/teacher" className="mx-auto rounded-lg border p-4 hover:bg-cyan-50">
							Go to Teacher's Panel
						</Link>
						<Link href="/admin" className="mx-auto rounded-lg border p-4 hover:bg-cyan-50">
							Go to Admin's Panel
						</Link>
						<Button onClick={() => signOut()}>Sign Out</Button>
					</>
				) : (
					<>
						<p className="text-2xl">Sign in to access our learning platform</p>
						<Button onClick={() => signIn('google')}>Sign In with Google</Button>
					</>
				)}
			</div>
		</>
	);
};

export default Home;

const AuthShowcase: React.FC = () => {
	const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

	const { data: sessionData } = useSession();

	return (
		<div className="flex flex-col items-center justify-center gap-2">
			{sessionData && <p className="text-2xl text-blue-500">Logged in as {sessionData?.user?.name}</p>}
			{secretMessage && <p className="text-2xl text-blue-500">{secretMessage}</p>}
			<button
				className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
				onClick={sessionData ? () => signOut() : () => signIn()}>
				{sessionData ? 'Sign out' : 'Sign in'}
			</button>
		</div>
	);
};
