import { Button, Card } from 'flowbite-react';
import { type NextPage } from 'next';
import { useState } from 'react';
import CreateClassroom from '../../components/admin/classroom/create-card.classroom';
import { trpc } from '../../lib/trpc';

const ClassesPanel: NextPage = () => {
	const { data, isLoading } = trpc.classroom.classrooms.useQuery();

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
				<CreateClassroom />
			</Card>
		</div>
	);
};

export default ClassesPanel;
