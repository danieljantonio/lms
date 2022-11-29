import { Button, Card } from 'flowbite-react';
import { type NextPage } from 'next';
import { useState } from 'react';
import { trpc } from '../../../lib/trpc';

const JoinClassroom: NextPage = () => {
	const [classCode, setClassCode] = useState('');
	const joinClass = trpc.classroom.join.useMutation({
		onSuccess(data) {
			console.log('Joined classroom');
		},
	});

	return (
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
	);
};

export default JoinClassroom;
