import { Button, Card, TextInput } from 'flowbite-react';
import { FC, useState } from 'react';
import { ChoiceData, ChoiceProps, QuestionInputProps } from '../../types/tests';
import ChoiceInput from './choice-input.tests';

const QuestionInput: FC<QuestionInputProps> = ({ index, updateQuestion }) => {
	let initQuestionChoice: ChoiceProps = {
		answer: '',
		isCorrectAnswer: false,
	};

	const initChoices = [
		{ answer: 'Test', isCorrectAnswer: false },
		{ answer: 'asasfddf', isCorrectAnswer: false },
		{ answer: 'twe', isCorrectAnswer: false },
		{ answer: 'ba', isCorrectAnswer: false },
	];

	const [loading, setLoading] = useState(false);
	const [choices, setChoices] = useState<ChoiceProps[]>(initChoices);

	const addNewChoice = async () => {
		setLoading(true);
		let qc = choices;
		qc.push(initQuestionChoice);
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

	const setAnswer = async (newChoice: ChoiceData, index: number) => {
		const _qc = choices;
		_qc[index] = newChoice;
		await setChoices(_qc);
	};

	return (
		<Card className="mt-4">
			<TextInput addon={`Q${index + 1}`} />
			{loading ? (
				<div>Loading..s.</div>
			) : (
				choices.map((questionChoice, index) => {
					return (
						<ChoiceInput
							key={index}
							data={questionChoice}
							setAnswer={(newChoice) => {
								setAnswer(newChoice, index);
							}}
							removeChoice={() => removeChoice(index)}
						/>
					);
				})
			)}
			<Button disabled={choices.length > 4} color="light" onClick={addNewChoice}>
				Add Choice
			</Button>
			<Button onClick={() => console.log(choices)}>Log</Button>
		</Card>
	);
};

export default QuestionInput;
