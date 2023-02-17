import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { Button, Modal } from 'flowbite-react';
import { FC } from 'react';

type Props = {
	show: boolean;
	setClose: () => void;
};

const QCInputRequiredModal: FC<Props> = ({ show, setClose }) => {
	return (
		<Modal show={show} size="md" popup={true} onClose={setClose}>
			<Modal.Header />
			<Modal.Body>
				<div className="text-center">
					<ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
					<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						Please fill in all questions and choices.
					</h3>
					<div className="flex justify-center gap-4">
						<Button color="gray" onClick={setClose}>
							Ok
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default QCInputRequiredModal;
