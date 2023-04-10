import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useAuth from '@/lib/hooks/useAuth';
import { trpc } from '@/lib/trpc';

const JoinSchool: NextPage = () => {
	const { user, isLoading, isAuthenticated } = useAuth();
	const [schoolCode, setSchoolCode] = useState<string>('');
	const router = useRouter();

	const joinSchool = trpc.school.join.useMutation({
		onSuccess(data) {
			router.push('/app');
		},
	});

	if (isLoading) return <div>Loading...</div>;

	if (!isAuthenticated) router.push('/');

	if (user?.schoolId) router.push('/app');

	return (
		<div className="flex flex-col-reverse md:flex-row h-screen items-center justify-center">
			<div className=" md:pl-36">
				<div className="card shadow-xl mx-2 border border-base-300 w-fit">
					<div className="card-body sm:min-w-[400px] max-w-[500px]">
						<form
							className="flex flex-col gap-4"
							onSubmit={() =>
								joinSchool.mutate({ code: schoolCode })
							}>
							<p className="text-2xl">Welcome, {user?.name}</p>
							<input
								type="text"
								className="w-full input input-bordered bg-base-200"
								value={schoolCode}
								onChange={(e) =>
									setSchoolCode(e.target.value.toUpperCase())
								}
								maxLength={6}
								minLength={6}
								placeholder="Enter School Code"
								required
							/>
							<div className="card-actions justify-end">
								<button
									type="submit"
									className="btn w-fit btn-primary ">
									Join School
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className="flex md:w-2/5 justify-center md:justify-end mb-6">
				<div className="md:rotate-90 text-7xl md:text-9xl">Ignosi</div>
			</div>
		</div>
	);
};

export default JoinSchool;
