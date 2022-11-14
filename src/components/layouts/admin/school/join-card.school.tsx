import { Button, Card } from 'flowbite-react';
import React, { FC, useState } from 'react';
import { trpc } from '../../../../lib/trpc';

const JoinSchoolCard: FC = () => {
	const [invite, setInvite] = useState('');
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
					setInvite(e.target.value);
				}}
			/>
			<Button onClick={() => createSchool.mutate({ invite })}>Create School</Button>
		</Card>
	);
};

export default JoinSchoolCard;
