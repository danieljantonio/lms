import { Test } from '@prisma/client';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useState } from 'react';
import { trpc } from '../../lib/trpc';

type Props = {
	toggle: (open: boolean) => void;
	isOpen: boolean;
	onStartTest: () => void;
	testDetails: Test;
};

const StartPrompt: FC<PropsWithChildren<Props>> = ({ toggle, isOpen, onStartTest, testDetails }) => {
	const closeModal = () => toggle(false);

	return (
		<Modal show={isOpen} onClose={closeModal}>
			<Modal.Header>Do you want to start the test - {testDetails.name}?</Modal.Header>
			<Modal.Body>
				<ul className="list-disc p-6">
					<li>You have {testDetails.duration} minutes from the moment you start the test.</li>
					<li>You may not stop in the middle of the test.</li>
					<li>
						If you fail to complete all the questions within the given time, you will only be marked on what
						you have finished.
					</li>
				</ul>
			</Modal.Body>
			<Modal.Footer>
				<Button disabled={false} onClick={onStartTest}>
					Start Test
				</Button>
				<Button disabled={false} color="gray" onClick={closeModal}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default StartPrompt;
