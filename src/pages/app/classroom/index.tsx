import { PlusSmallIcon } from '@heroicons/react/24/solid';
import { Button, Card } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CreateClassModal from '../../../components/classroom/create-modal.classroom';
import JoinClassModal from '../../../components/classroom/join-modal.classroom';
import useAuth from '../../../lib/hooks/useAuth';
import { trpc } from '../../../lib/trpc';

const Classes: NextPage = () => {
	const { data, isLoading } = trpc.classroom.getClassrooms.useQuery();
	const router = useRouter();
	const { role } = useAuth();

	const [modalIsOpen, toggleModalOpen] = useState<boolean>(false);

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>No classroom data found</div>;

	return (
		<div className="flex w-full flex-col justify-between">
			<p className="mb-6 text-2xl">My Classes:</p>
			<div className="flex flex-col gap-4">
				{data.length === 0 && <Card className="h-24 w-40">0 Classes</Card>}
				{data.map(({ classroom }) => (
					<Card
						className="h-24 w-full hover:cursor-pointer hover:bg-slate-100"
						key={classroom.id}
						onClick={() => router.push(`/app/classroom/${classroom.code.toLowerCase()}`)}>
						<p className="text-lg">{classroom.name}</p>
					</Card>
				))}
			</div>
			<Button
				color="light"
				onClick={() => toggleModalOpen(true)}
				className="absolute bottom-5 right-5 h-12 w-12 rounded-full">
				<PlusSmallIcon height={30} width={30} className="mx-auto" />
			</Button>
			{role === 'STUDENT' && (
				<JoinClassModal
					isOpen={modalIsOpen}
					toggle={(isOpen) => {
						toggleModalOpen(isOpen);
					}}
				/>
			)}
			{role === 'TEACHER' && (
				<CreateClassModal
					isOpen={modalIsOpen}
					toggle={(isOpen) => {
						toggleModalOpen(isOpen);
					}}
				/>
			)}
		</div>
	);
};

export default Classes;
