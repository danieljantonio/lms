import { XMarkIcon } from '@heroicons/react/24/solid';
import { Button, Card, TextInput } from 'flowbite-react';
import { FC, useEffect, useState } from 'react';
import {
	ChoiceData,
	ChoiceProps,
	QuestionInputProps,
} from '../../../types/tests';
import ChoiceInput from '../create/choice-input.tests';
import { XCircle } from '@phosphor-icons/react';

const QuestionInput: FC<QuestionInputProps> = ({
	index,
	updateQuestion,
	data,
	removeQuestion,
}) => {
	const [question, setQuestion] = useState<string>(data?.question || '');
	const [loading, setLoading] = useState(false);
	const [choices, setChoices] = useState<ChoiceProps[]>(
		data?.choices || [
			{
				answer: '',
				isCorrect: false,
			},
		],
	);

	const addNewChoice = async () => {
		setLoading(true);
		let qc = choices;
		qc.push({
			answer: '',
			isCorrect: false,
		});
		await setChoices(qc);
		setLoading(false);
	};

	const removeChoice = async (index: number) => {
		setLoading(true);
		let qc = choices;
		qc.splice(index, 1);
		await setChoices(qc);
		setLoading(false);
	};

	useEffect(() => {
		updateQuestion({ question, choices });
	}, [choices, question]);

	const updateAnswer = async (newChoice: ChoiceData, index: number) => {
		let _qc = choices;
		if (newChoice.isCorrect) {
			setLoading(true);
			_qc = await _qc.map((choice) => {
				choice.isCorrect = false;
				return choice;
			});
			setLoading(false);
		}
		_qc[index] = newChoice;
		await setChoices(_qc);
	};

	return (
		<div className="card border mt-4">
			<div className="relative card-body">
				<label className="label text-sm pl-0">
					Question {index + 1}
				</label>
				<input
					type="text"
					placeholder={`Question ${index + 1}`}
					className="input input-bordered w-full"
					onChange={(e) => setQuestion(e.target.value)}
				/>
				<XCircle
					size={24}
					weight="fill"
					onClick={removeQuestion}
					className="absolute right-4 top-4 mx-auto w-5 text-gray-500 hover:cursor-pointer hover:text-gray-800"
				/>
				{loading ? (
					<div>Loading...</div>
				) : (
					choices.map((questionChoice, index) => {
						return (
							<ChoiceInput
								key={index}
								data={questionChoice}
								setAnswer={(newChoice) => {
									updateAnswer(newChoice, index);
								}}
								removeChoice={() => removeChoice(index)}
							/>
						);
					})
				)}
				<div className="card-actions justify-end">
					<button
						className="btn btn-info text-white"
						onClick={addNewChoice}
						disabled={choices.length >= 4}>
						Add Choice
					</button>
				</div>
			</div>
		</div>
	);
};

export default QuestionInput;
