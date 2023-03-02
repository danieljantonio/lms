import { PlusSmallIcon } from '@heroicons/react/24/solid';
import { Button } from 'flowbite-react';
import { type NextPage } from 'next';
import { useState } from 'react';
import CreateClassModal from '../../components/classroom/create-modal.classroom';
import JoinClassModal from '../../components/classroom/join-modal.classroom';
import useAuth from '../../lib/hooks/useAuth';

const App: NextPage = () => {
	const { role } = useAuth();

	const [modalIsOpen, toggleModalOpen] = useState<boolean>(false);
	return (
		<div>
			<h1>App Home</h1>

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

export default App;
