import { Button, Card } from 'flowbite-react';
import React, { FC, useState } from 'react';
import { trpc } from '../../../lib/trpc';

const CreateSchoolCard: FC = () => {
	const [schoolInput, setSchoolInput] = useState({ name: '', code: '' });
	const createSchool = trpc.school.create.useMutation({
		onSuccess(data) {
			console.log('Created school', data.name);
		},
	});

	return (
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
					setSchoolInput({ ...schoolInput, code: e.target.value });
				}}
			/>
			<Button onClick={() => createSchool.mutate(schoolInput)}>Create School</Button>
		</Card>
	);
};

export default CreateSchoolCard;
