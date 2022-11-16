import { Card } from 'flowbite-react';
import { type NextPage } from 'next';
import { trpc } from '../../lib/trpc';

const TeacherPanel: NextPage = () => {
	const { data: school, isLoading: schoolLoading } = trpc.school.get.useQuery();

	if (schoolLoading) return <div>Loading...</div>;

	return (
		<div className="flex flex-col justify-center gap-4">
			<h1>Teacher's Dashboard</h1>
			<p>
				This will be a temporary place to run commands and test routes such as create school, create x, add x,
				add y, as it should be all automated in the future.
			</p>
			<p>School: {school?.name}</p>
		</div>
	);
};

export default TeacherPanel;
