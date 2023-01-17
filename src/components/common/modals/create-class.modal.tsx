import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useState } from 'react';
import { trpc } from '../../../lib/trpc';

type Props = {
	toggle: (open: boolean) => void;
	isOpen: boolean;
};

const JoinClass: FC<PropsWithChildren<Props>> = ({ toggle, isOpen }) => {
	const closeModal = () => toggle(false);
	const [classCode, setClassCode] = useState<string>('');
	const [className, setClassName] = useState<string>('');
	const router = useRouter();
	const createClass = trpc.classroom.create.useMutation({
		onSuccess: (data) => {
			console.log(data);
			router.push(`/app/classroom/${classCode}`);
		},
	});

	return (
		<Modal show={isOpen} onClose={closeModal}>
			<Modal.Header>Create New Classroom</Modal.Header>
			<Modal.Body>
				<div className="my-2">
					<div className="mb-2">
						<Label value="Enter class name:" />
					</div>
					<TextInput
						placeholder="ABC123"
						value={className}
						onChange={(e) => setClassName(e.target.value.toUpperCase())}
						required
						maxLength={6}
						minLength={6}
					/>
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
					{createClass.error && <p>Something went wrong! {createClass.error.message}</p>}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button
					disabled={createClass.isLoading}
					onClick={() => createClass.mutate({ code: classCode, name: className })}>
					Join
				</Button>
				<Button disabled={createClass.isLoading} color="gray" onClick={closeModal}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default JoinClass;
