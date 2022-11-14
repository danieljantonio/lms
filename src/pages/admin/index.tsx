import { Button, Card } from 'flowbite-react';
import { type NextPage } from 'next';
import { useState } from 'react';
import TeacherLayout from '../../components/layouts/teacher.layout';
import { trpc } from '../../lib/trpc';

const TeacherPanel: NextPage = () => {
	return (
		<TeacherLayout>
			<div className="flex flex-col justify-center gap-2">
				<h1>Admin Dashboard</h1>
				<p>
					This will be a place where all the functions will be created. It'll have all the helper functions
					that would aid in the development of the whole app.
				</p>
				<div className="flex">
					<SchoolCard />
				</div>
			</div>
		</TeacherLayout>
	);
};

export default TeacherPanel;

const SchoolCard = () => {
	const [schoolInput, setSchoolInput] = useState({ name: '', invite: '' });
	const createSchool = trpc.school.create.useMutation({
		onSuccess(data) {
			console.log('Created school', data.name);
		},
	});

	return (
		<Card>
			School
			<Card>
				<p>Create School</p>
				<input
					type="text"
					className="rounded-lg"
					placeholder="School Name"
					onChange={(e) => {
						setSchoolInput({ ...schoolInput, name: e.target.value });
					}}
				/>
				<input
					type="text"
					className="rounded-lg"
					placeholder="School Code"
					onChange={(e) => {
						setSchoolInput({ ...schoolInput, invite: e.target.value });
					}}
				/>
				<Button onClick={() => createSchool.mutate(schoolInput)}>Create School</Button>
			</Card>
		</Card>
	);
};
