import { type NextPage } from 'next';
import TeacherLayout from '../../components/layouts/teacher.layout';
import { trpc } from '../../lib/trpc';

const ClassesPanel: NextPage = () => {
	const { data, isLoading } = trpc.class.numberOfClasses.useQuery();

	if (isLoading) return <div>Loading...</div>;

	return (
		<TeacherLayout>
			<div className="flex flex-col items-center justify-center gap-2">
				<div>
					<h1>This page will list all the classes</h1>
					<p>You have {data} classes</p>
				</div>
			</div>
		</TeacherLayout>
	);
};

export default ClassesPanel;
