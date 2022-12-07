import { Label, TextInput } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useAuth from '../../lib/hooks/useAuth';

const JoinSchool: NextPage = () => {
	const { user, isLoading, isAuthenticated, role } = useAuth();
	const router = useRouter();

	if (isLoading) return <div>Loading...</div>;

	if (!isAuthenticated) router.push('/');

	if (user?.schoolId) router.push('/app');

	return (
		<div className="flex flex-col">
			<div className="mx-auto">
				<div className="mb-2 block">
					<Label htmlFor="small" value="Enter School Code" />
				</div>
				<TextInput id="small" type="text" sizing="sm" />
			</div>
		</div>
	);
};

export default JoinSchool;
