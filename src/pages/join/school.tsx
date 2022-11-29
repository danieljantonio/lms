import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useAuth from '../../lib/hooks/useAuth';

const JoinSchool: NextPage = () => {
	const { user, isLoading, isAuthenticated, role } = useAuth();
	const router = useRouter();

	if (isLoading) return <div>Loading...</div>;

	if (!isAuthenticated) router.push('/');

	if (user.schoolId) router.push('/app');

	return <div className="mx-auto flex max-w-5xl flex-col"></div>;
};

export default JoinSchool;
