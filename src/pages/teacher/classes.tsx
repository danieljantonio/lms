import { Button, Card } from 'flowbite-react';
import { type NextPage } from 'next';
import { useState } from 'react';
import { trpc } from '../../lib/trpc';

const ClassesPanel: NextPage = () => {
	const { data, isLoading } = trpc.classroom.classrooms.useQuery();
	const createClass = trpc.classroom.create.useMutation({
		onSuccess(data) {
			console.log('Created class', data.name);
		},
	});
	const [schoolInput, setSchoolInput] = useState('');

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
				<Card>
					<p>Create Class</p>
					<input
						type="text"
						className="rounded-lg"
						placeholder="Class Name"
						onChange={(e) => {
							setSchoolInput(e.target.value);
						}}
					/>
					<Button
						onClick={() => {
							console.log(schoolInput);
							createClass.mutate({ name: schoolInput });
						}}>
						Create Class
					</Button>
				</Card>
			</Card>
		</div>
	);
};

export default ClassesPanel;
