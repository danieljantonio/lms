import { type NextPage } from 'next';
import TeacherLayout from '../../components/layouts/teacher.layout';

const ClassesPanel: NextPage = () => {
	return (
		<TeacherLayout>
			<div className="flex flex-col items-center justify-center gap-2">
				<div>
					<h1>This page will list all the classes</h1>
				</div>
			</div>
		</TeacherLayout>
	);
};

export default ClassesPanel;
