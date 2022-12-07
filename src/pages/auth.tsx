import { Button } from 'flowbite-react';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import CommonLayout from '../components/layouts/common.layout';
import useAuth from '../lib/hooks/useAuth';

const AuthPage: NextPage = () => {
	const { user, isLoading, isAuthenticated } = useAuth();
	const router = useRouter();

	if (isLoading) return <div>Loading...</div>;

	if (isAuthenticated) {
		if (!user?.schoolId) router.push('/join');
		else router.push('/app');
	}

	return (
		<CommonLayout>
			<div className="flex h-full items-center justify-center">
				<div className="w-5/12">
					<div className="flex flex-col items-start justify-center gap-6 px-14">
						<p className="text-8xl">Ignosi</p>
						<p className="font-serif text-lg">Start your education journey with us.</p>
					</div>
				</div>
				<div className="flex w-7/12 flex-col items-center justify-center gap-10">
					<p className="text-4xl">Welcome to Ignosi!</p>
					<Button onClick={() => signIn('google')} className="px-10">
						Login with Google
					</Button>
				</div>
			</div>
		</CommonLayout>
	);
};

export default AuthPage;
