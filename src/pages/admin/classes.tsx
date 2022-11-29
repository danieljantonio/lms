import { Button, Card } from 'flowbite-react';
import { type NextPage } from 'next';
import { useState } from 'react';
import CreateClassroom from '../../components/admin/classroom/create-card.classroom';
import JoinSchoolCard from '../../components/admin/school/join-card.school';
import { trpc } from '../../lib/trpc';

const ClassesPanel: NextPage = () => {
	const { data, isLoading } = trpc.classroom.classrooms.useQuery();
	const [classCode, setClassCode] = useState('');
	const joinClass = trpc.classroom.join.useMutation({
		onSuccess(data) {
			console.log('Joined classroom');
		},
	});

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="flex flex-col items-start justify-center gap-2">
			<div>
				<h1>This page will list all the classes</h1>
				<div>
					<p>You have {data?.length ? data.length : 0} classes:</p>
					{data?.map((classroom, i) => (
						<p key={i}>- {classroom.name}</p>
					))}
				</div>
			</div>
			<Card>
				<p className="text-2xl">Actions</p>
				<div className="flex gap-6">
					<CreateClassroom />
					<Card>
						<p>Join Classroom</p>
						<input
							type="text"
							className="rounded-lg"
							placeholder="Class Code"
							onChange={(e) => {
								setClassCode(e.target.value);
							}}
						/>
						<Button onClick={() => joinClass.mutate({ code: classCode })}>Join Class</Button>
					</Card>
				</div>
			</Card>
		</div>
	);
};

export default ClassesPanel;
