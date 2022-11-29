import { Button, Card } from 'flowbite-react';
import React, { FC, useState } from 'react';
import { trpc } from '../../../lib/trpc';

const JoinSchoolCard: FC = () => {
	const [code, setCode] = useState('');
	const createSchool = trpc.school.join.useMutation({
		onSuccess(data) {
			console.log('Joined school', data.name);
		},
	});

	return (
		<Card>
			<p>Join School</p>
			<input
				type="text"
				className="rounded-lg"
				placeholder="Invite Code"
				onChange={(e) => {
					setCode(e.target.value);
				}}
			/>
			<Button onClick={() => createSchool.mutate({ code: code })}>Join School</Button>
		</Card>
	);
};

export default JoinSchoolCard;
