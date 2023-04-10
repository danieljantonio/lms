import { FC, useState } from 'react';
import { ChoiceInputProps } from '@/types/tests';
import { Check, X } from '@phosphor-icons/react';

const ChoiceInput: FC<ChoiceInputProps> = ({
	data,
	setAnswer,
	removeChoice,
}) => {
	const [answer, _setAnswer] = useState<string>(data.answer);
	const [isCorrect, _setIsCorrect] = useState<boolean>(data.isCorrect);

	const toggleCorrect = async () => {
		if (isCorrect) return;
		setAnswer({
			answer,
			isCorrect: !isCorrect,
		});
		_setIsCorrect(!isCorrect);
	};

	const onChangeChoice = async (e: any) => {
		setAnswer({
			answer: e.target.value,
			isCorrect: isCorrect,
		});
		_setAnswer(e.target.value);
	};

	return (
		<div className="form-control">
			<div className="input-group">
				<button
					className={`btn btn-square btn-success ${
						isCorrect ? '' : 'btn-outline'
					}`}
					onClick={toggleCorrect}
					type="button">
					<Check weight="bold" size={18} />
				</button>
				<input
					defaultValue={answer}
					type="text"
					placeholder="Multiple Choice"
					className={`input input-bordered w-full ${
						isCorrect ? 'outline-success' : ''
					}`}
					onBlur={onChangeChoice}
				/>
				<button
					onClick={() => removeChoice()}
					className="btn btn-square btn-error btn-outline"
					type="button">
					<X weight="bold" size={18} />
				</button>
			</div>
		</div>
	);
};

export default ChoiceInput;
