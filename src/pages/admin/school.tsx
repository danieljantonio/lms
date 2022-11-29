import { Card } from 'flowbite-react';
import CreateSchoolCard from '../../components/admin/school/create-card.school';
import JoinSchoolCard from '../../components/admin/school/join-card.school';
import { trpc } from '../../lib/trpc';

const AdminSchool = () => {
	const { data: schools, isLoading: schoolsIsLoading } = trpc.school.getAll.useQuery();

	return (
		<div className="flex flex-col items-start gap-2">
			<p>This is the admin's school panel</p>
			<div className="flex w-full justify-between">
				<Card>
					School Actions
					<div className="flex gap-4">
						<CreateSchoolCard />
						<JoinSchoolCard />
					</div>
				</Card>
				<Card>
					{schoolsIsLoading ? (
						<div>Loading...</div>
					) : (
						<div>
							<p className="text-lg font-bold">List of Available Schools</p>
							{schools?.map((school, i) => (
								<p>
									{school.name} - {school.code}
								</p>
							))}
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};

export default AdminSchool;
