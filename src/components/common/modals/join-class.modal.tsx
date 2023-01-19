import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useState } from 'react';
import { trpc } from '../../../lib/trpc';

type Props = {
	toggle: (open: boolean) => void;
	isOpen: boolean;
};

const JoinClassModal: FC<PropsWithChildren<Props>> = ({ toggle, isOpen }) => {
	const closeModal = () => toggle(false);
	const [classCode, setClassCode] = useState<string>('');
	const router = useRouter();
	const joinClass = trpc.classroom.join.useMutation({
		onSuccess: (data) => {
			console.log(data);
			router.push(`/app/classroom/${classCode}`);
		},
	});

	return (
		<Modal show={isOpen} onClose={closeModal}>
			<Modal.Header>Join a Class</Modal.Header>
			<Modal.Body>
				<div className="my-2">
					<div className="mb-2">
						<Label value="Enter class code:" />
					</div>
					<TextInput
						placeholder="ABC123"
						value={classCode}
						onChange={(e) => setClassCode(e.target.value.toUpperCase())}
						required
						maxLength={6}
						minLength={6}
					/>
					{joinClass.error && <p>Something went wrong! {joinClass.error.message}</p>}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button disabled={joinClass.isLoading} onClick={() => joinClass.mutate({ code: classCode })}>
					Join
				</Button>
				<Button disabled={joinClass.isLoading} color="gray" onClick={closeModal}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default JoinClassModal;
