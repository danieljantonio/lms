import { XMarkIcon } from '@heroicons/react/24/solid';
import { Button, Card, TextInput } from 'flowbite-react';
import { FC, useEffect, useState } from 'react';
import { ChoiceData, ChoiceProps, QuestionInputProps } from '../../types/tests';
import ChoiceInput from './choice-input.tests';

const QuestionInput: FC<QuestionInputProps> = ({ index, updateQuestion, data, removeQuestion }) => {
	const [question, setQuestion] = useState<string>(data?.question || '');
	const [loading, setLoading] = useState(false);
	const [choices, setChoices] = useState<ChoiceProps[]>(data?.choices || []);

	const addNewChoice = async () => {
		setLoading(true);
		let qc = choices;
		qc.push({
			answer: '',
			isCorrectAnswer: false,
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
		if (newChoice.isCorrectAnswer) {
			setLoading(true);
			_qc = await _qc.map((choice) => {
				choice.isCorrectAnswer = false;
				return choice;
			});
			setLoading(false);
		}
		_qc[index] = newChoice;
		await setChoices(_qc);
	};

	const log = () => {
		console.log({ question, choices });
	};

	return (
		<Card className="relative mt-4 p-4">
			<XMarkIcon
				onClick={removeQuestion}
				className="absolute right-4 top-4 mx-auto w-5 text-gray-500 hover:cursor-pointer hover:text-gray-800"
			/>
			<TextInput defaultValue={question} addon={index + 1} onChange={(e) => setQuestion(e.target.value)} />
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
			<Button disabled={choices.length > 4} color="light" onClick={addNewChoice}>
				Add Choice
			</Button>
			<Button onClick={log}>Log</Button>
		</Card>
	);
};

export default QuestionInput;
