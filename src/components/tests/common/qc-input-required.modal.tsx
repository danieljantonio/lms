import { WarningCircle } from '@phosphor-icons/react';
import { FC } from 'react';

type Props = {
	show: boolean;
	setClose: () => void;
};

const QCInputRequiredModal: FC<Props> = ({ show, setClose }) => {
	return (
		<>
			{/* The button to open modal */}
			<input
				type="checkbox"
				id="my-modal-2"
				className="modal-toggle"
				checked={show}
			/>

			<div className="modal" id="my-modal-2">
				<div className="modal-box">
					<WarningCircle
						size={54}
						weight="fill"
						className="mx-auto my-4"
					/>
					<h3 className="font-bold text-lg text-center">
						Please fill in all questions and choices.
					</h3>
					<div className="modal-action">
						<button className="btn" onClick={setClose}>
							Ok!
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default QCInputRequiredModal;
