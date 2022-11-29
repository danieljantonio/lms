import { Button, Card } from 'flowbite-react';
import { type NextPage } from 'next';
import { useState } from 'react';
import { trpc } from '../../../lib/trpc';

const CreateClassroom: NextPage = () => {
	const [schoolInput, setSchoolInput] = useState({ name: '', code: '', schoolCode: '' });

	const createClass = trpc.classroom.create.useMutation({
		onSuccess(data) {
			console.log('Created class', data.name);
		},
	});

	return (
		<Card>
			<p>Create Class</p>
			<input
				type="text"
				className="rounded-lg"
				placeholder="Class Name"
				onChange={(e) => {
					setSchoolInput({ ...schoolInput, name: e.target.value });
				}}
			/>
			<input
				type="text"
				className="rounded-lg"
				placeholder="Class Code"
				onChange={(e) => {
					setSchoolInput({ ...schoolInput, code: e.target.value });
				}}
			/>
			<input
				type="text"
				className="rounded-lg"
				placeholder="School Code | Admin Only"
				onChange={(e) => {
					setSchoolInput({ ...schoolInput, schoolCode: e.target.value });
				}}
			/>
			<Button onClick={() => createClass.mutate(schoolInput)}>Create Class</Button>
		</Card>
	);
};

export default CreateClassroom;
