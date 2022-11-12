import { type NextPage } from 'next';
import TeacherLayout from '../../components/layouts/teacher.layout';

const TestsPanel: NextPage = () => {
	return (
		<TeacherLayout>
			<div className="flex flex-col items-center justify-center gap-2">
				<div>
					<h1>This is the place to handle and manage all of the tests available.</h1>
				</div>
			</div>
		</TeacherLayout>
	);
};

export default TestsPanel;
