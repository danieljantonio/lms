import { type NextPage } from 'next';
import useAuth from '../lib/hooks/useAuth';
import { useRouter } from 'next/router';
import AuthForm from '../components/auth/auth-form';

const Home: NextPage = () => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	if (isAuthenticated) router.push('/app');

	return (
		<>
			<div className="container mx-auto space-y-4 mt-6">
				<p className="text-7xl">Ignosi</p>
				<p className="text-4xl font-light">
					Welcome to a simpler and more efficient learning platform.
				</p>
				<AuthForm />
			</div>
		</>
	);
};

export default Home;
