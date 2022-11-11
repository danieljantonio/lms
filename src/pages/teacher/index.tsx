import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import TeacherLayout from '../../components/layouts/teacher.layout';
import { trpc } from '../../utils/trpc';

const App: NextPage = () => {
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

export default App;
