import { type NextPage } from 'next';
import TeacherLayout from '../../components/layouts/teacher.layout';

const TeacherPanel: NextPage = () => {
	return (
		<TeacherLayout>
			<div className="flex flex-col items-center justify-center gap-2">
				<div>
					<h1>Admin Home</h1>
					<p>
						This will be a temporary place to run commands and test routes such as create school, create x,
						add x, add y, as it should be all automated in the future.
					</p>
				</div>
			</div>
		</TeacherLayout>
	);
};

export default TeacherPanel;
