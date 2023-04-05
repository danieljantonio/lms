import { type TestTemplate } from '@prisma/client';
import { Button, Modal } from 'flowbite-react';
import { FC, PropsWithChildren } from 'react';

type Props = {
	onTakeTest: () => void;
	testDetails: TestTemplate;
	loading: boolean;
};

const StartPrompt: FC<PropsWithChildren<Props>> = ({
	onTakeTest,
	testDetails,
	loading,
}) => {
	return (
		<>
			<input
				type="checkbox"
				id="test-start-prompt"
				className="modal-toggle"
			/>
			<div className="modal">
				<div className="modal-box relative">
					<label
						htmlFor="test-start-prompt"
						className="btn btn-sm btn-circle absolute right-2 top-2">
						✕
					</label>
					<ul className="list-disc p-6">
						<li>
							You have {testDetails.duration} minutes from the
							moment you start the test.
						</li>
						<li>You may not stop in the middle of the test.</li>
						<li>
							If you fail to complete all the questions within the
							given time, you will only be marked on what you have
							finished.
						</li>
					</ul>
					<div className="modal-action">
						<button
							disabled={loading}
							className="btn"
							onClick={onTakeTest}>
							Take Test
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default StartPrompt;
