import { Card } from 'flowbite-react';
import { type NextPage } from 'next';
import CreateSchoolCard from '../../components/admin/school/create-card.school';
import JoinSchoolCard from '../../components/admin/school/join-card.school';

const TeacherPanel: NextPage = () => {
	return (
		<div className="flex flex-col justify-center gap-2">
			<h1>Admin Dashboard</h1>
			<p>
				This will be a place where all the functions will be created. It'll have all the helper functions that
				would aid in the development of the whole app.
			</p>
			<Card>
				School Actions
				<div className="flex gap-4">
					<CreateSchoolCard />
					<JoinSchoolCard />
				</div>
			</Card>
		</div>
	);
};

export default TeacherPanel;
