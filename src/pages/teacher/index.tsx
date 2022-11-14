import { Card } from 'flowbite-react';
import { type NextPage } from 'next';
import TeacherLayout from '../../components/layouts/teacher.layout';
import { trpc } from '../../lib/trpc';

const TeacherPanel: NextPage = () => {
	const { data, isLoading } = trpc.school.get.useQuery();

	if (isLoading) return <div>Loading...</div>;

	console.log(data);

	return (
		<TeacherLayout>
			<div className="flex flex-col justify-center gap-4">
				<h1>Teacher's Dashboard</h1>
				<p>
					This will be a temporary place to run commands and test routes such as create school, create x, add
					x, add y, as it should be all automated in the future.
				</p>
				<Card>School: {data?.name}</Card>
			</div>
		</TeacherLayout>
	);
};

export default TeacherPanel;
