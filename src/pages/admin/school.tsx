import { Card } from 'flowbite-react';
import CreateSchoolCard from '../../components/admin/school/create-card.school';
import JoinSchoolCard from '../../components/admin/school/join-card.school';

const AdminSchool = () => {
	return (
		<div className="flex flex-col justify-center gap-2">
			<p>This is the admin's school panel</p>
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

export default AdminSchool;
