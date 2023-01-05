import { Button, Card } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CreateClassroom from '../../../components/admin/classroom/create-card.classroom';
import useAuth from '../../../lib/hooks/useAuth';
import { trpc } from '../../../lib/trpc';

const CLasses: NextPage = () => {
	const { data, isLoading } = trpc.classroom.getUserClassrooms.useQuery();
	const router = useRouter();
	const { role } = useAuth();

	const [showCreate, toggleCreate] = useState<boolean>(false);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="flex flex-col justify-between">
			{/* Allows teachers, principals, and admins to create class */}
			{role !== 'STUDENT' ? (
				<div className="absolute right-5 bottom-5 flex flex-col">
					{showCreate ? <CreateClassroom /> : null}
					<Button onClick={() => toggleCreate(!showCreate)}>Create new class</Button>
				</div>
			) : null}
			{/* This renders the classes available/enrolled by the student */}
			<div className="mb-6 text-2xl">Your Classes:</div>
			<div className="flex gap-4">
				{data?.length === 0 ? <Card className="h-24 w-40 ">0 Classes</Card> : null}
				{data?.map(({ classroom }) => (
					<Card
						className="h-24 w-40 hover:cursor-pointer hover:bg-slate-100"
						key={classroom.id}
						onClick={() => router.push(`/app/classroom/${classroom.code.toLowerCase()}`)}>
						{classroom.name}
					</Card>
				))}
			</div>
		</div>
	);
};

export default CLasses;
