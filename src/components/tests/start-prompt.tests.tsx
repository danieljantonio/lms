import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useState } from 'react';
import { trpc } from '../../lib/trpc';

type Props = {
	toggle: (open: boolean) => void;
	isOpen: boolean;
	onStartTest: () => void;
};

const StartPrompt: FC<PropsWithChildren<Props>> = ({ toggle, isOpen, onStartTest }) => {
	const closeModal = () => toggle(false);
	const router = useRouter();

	return (
		<Modal show={isOpen} onClose={closeModal} popup={true}>
			<Modal.Header>Join a Class</Modal.Header>
			<Modal.Body></Modal.Body>
			<Modal.Footer>
				<Button disabled={false} onClick={onStartTest}>
					Join
				</Button>
				<Button disabled={false} color="gray" onClick={closeModal}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default StartPrompt;
