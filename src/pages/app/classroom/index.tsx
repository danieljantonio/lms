import { Button, Card } from 'flowbite-react';
import { NextPage } from 'next';
import { useState } from 'react';
import CreateClassroom from '../../../components/admin/classroom/create-card.classroom';
import useAuth from '../../../lib/hooks/useAuth';
import { trpc } from '../../../lib/trpc';

const CLasses: NextPage = () => {
	const { data, isLoading } = trpc.classroom.classrooms.useQuery();
	const { role } = useAuth();

	const [showCreate, toggleCreate] = useState<boolean>(false);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="flex flex-col justify-between">
			<Card>{data?.length} Classrooms</Card>
			{/* Allows teachers, principals, and admins to create class */}
			{role !== 'STUDENT' ? (
				<div className="absolute right-5 bottom-5 flex flex-col">
					{showCreate ? <CreateClassroom /> : null}
					<Button onClick={() => toggleCreate(!showCreate)}>Create new class</Button>
				</div>
			) : null}
			{/* This renders the classes available */}
			<div className="my-6 flex gap-6">
				{data?.map((classroom) => (
					<Card
						className="hover:cursor-pointer"
						key={classroom.id}
						onClick={() => console.log(`/classroom/${classroom.code.toLowerCase()}`)}>
						{classroom.name}
					</Card>
				))}
			</div>
		</div>
	);
};

export default CLasses;
