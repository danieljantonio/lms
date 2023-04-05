import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { FC, useState } from 'react';
import { ChoiceInputProps } from '../../../types/tests';
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

	return (
		<div className="relative w-full rounded-lg ">
			<input
				defaultValue={answer}
				className={`block w-full overflow-hidden rounded-lg border border-gray-300 p-2.5 !px-12 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
					isCorrect ? 'bg-green-200' : 'bg-gray-50'
				}`}
				onBlur={onChangeChoice}></input>
			<div
				onClick={toggleCorrect}
				className={`absolute inset-y-0 left-0 m-0.5 flex w-10 items-center rounded-md ${
					!isCorrect && ' hover:cursor-pointer hover:bg-green-300'
				}`}>
				<CheckIcon className="mx-auto w-5" />
			</div>
			<div
				onClick={() => removeChoice()}
				className="absolute inset-y-0 right-0 m-0.5 flex w-10 items-center rounded-md border-gray-300 hover:cursor-pointer hover:bg-red-300">
				<XMarkIcon className="mx-auto w-5" />
			</div>
		</div>
	);
};

export default ChoiceInput;
