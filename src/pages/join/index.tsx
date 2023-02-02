import { Button, TextInput } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CommonLayout from '../../components/layouts/common.layout';
import useAuth from '../../lib/hooks/useAuth';
import { trpc } from '../../lib/trpc';

const JoinSchool: NextPage = () => {
	const { user, isLoading, isAuthenticated } = useAuth();
	const [schoolCode, setSchoolCode] = useState<string>('');
	const router = useRouter();

	const joinSchool = trpc.school.join.useMutation({
		onSuccess(data) {
			console.log('Joined school', data.name);
			router.push('/app');
		},
	});

	if (isLoading) return <div>Loading...</div>;

	if (!isAuthenticated) router.push('/');

	if (user?.schoolId) router.push('/app');

	return (
		<CommonLayout>
			<div className="flex h-fullbar items-center">
				<div className="w-3/5 py-52 pl-36">
					<div>
						<p className="text-6xl">Start your education</p>
						<p className="text-6xl">journey with us.</p>
					</div>
					<form className="mt-12 flex gap-4" onSubmit={() => joinSchool.mutate({ code: schoolCode })}>
						<TextInput
							maxLength={6}
							minLength={6}
							type="text"
							id="schoolCode"
							required
							placeholder="Enter School Code"
							className="w-72"
							value={schoolCode}
							onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
						/>
						<Button type="submit">JOIN</Button>
					</form>
				</div>
				<div className="flex w-2/5 justify-end">
					<div className="rotate-90 text-9xl">Ignosi</div>
				</div>
			</div>
		</CommonLayout>
	);
};

export default JoinSchool;
