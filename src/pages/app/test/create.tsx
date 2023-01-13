import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { NextPage } from 'next';
import { FC, useEffect, useState } from 'react';

type MCQInputInputProps = {
	answer: string;
	isCorrectAnswer: boolean;
};

type MCQInputProps = {
	data: MCQInputInputProps;
	removeChoice: () => void;
	setAnswer: (newChoice: MCQInputInputProps) => void;
};

const MCQInput: FC<MCQInputProps> = ({ data, setAnswer, removeChoice }) => {
	const [answer, _setAnswer] = useState<string>(data.answer);
	const [isCorrect, _setIsCorrect] = useState<boolean>(data.isCorrectAnswer);

	const toggleCorrect = async () => {
		setAnswer({
			answer,
			isCorrectAnswer: !isCorrect,
		});
		_setIsCorrect(!isCorrect);
	};

	const onChangeChoice = async (e: any) => {
		setAnswer({
			answer: e.target.value,
			isCorrectAnswer: isCorrect,
		});
		_setAnswer(e.target.value);
	};

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
				className="absolute inset-y-0 left-0 m-0.5 flex w-10 items-center rounded-l-md p-1 hover:cursor-pointer hover:bg-green-200">
				<CheckIcon className="mx-auto w-5" />
			</div>
			<div
				onClick={() => removeChoice()}
				className="absolute inset-y-0 right-0 m-0.5 flex w-10 items-center rounded-r-md border-gray-300 p-1 hover:cursor-pointer hover:bg-red-400">
				<XMarkIcon className="mx-auto w-5" />
			</div>
		</div>
	);
};

type NewQuestionProp = {
	updateQuestion: any;
	index: number;
};

const NewQuestion: FC<NewQuestionProp> = ({ index, updateQuestion }) => {
	let initQuestionChoice: ChoiceProp = {
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
	const [choices, setChoices] = useState<ChoiceProp[]>(initChoices);

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

	const setAnswer = async (newChoice: MCQInputInputProps, index: number) => {
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
						<MCQInput
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

type ChoiceProp = {
	answer: string;
	isCorrectAnswer: boolean;
};

type QuestionProps = {
	question: string;
	choice: ChoiceProp[];
};

const CreateTest: NextPage = () => {
	const [questions, setQuestions] = useState<QuestionProps[]>([]);
	console.log(questions);

	return (
		<div className="mx-auto max-w-screen-xl">
			<Card>
				<p className="text-xl">Create New Test</p>
				<div className="flex w-full flex-col justify-between gap-6 lg:flex-row">
					<div className="lg:w-2/3">
						<Label>Test Name</Label>
						<TextInput placeholder="Test Name" />
					</div>
					<div className="gap-6 lg:w-1/3">
						<div>
							<Label>Start Date</Label>
							<TextInput placeholder="Test Name" type="datetime-local" />
						</div>
						<div className="mt-4">
							<Label>End Date</Label>
							<TextInput placeholder="Test Name" type="datetime-local" />
						</div>
					</div>
				</div>
			</Card>
			{/* 
			{questions?.map((question) => {
				// console.log(question);
			})} */}

			<NewQuestion updateQuestion={setQuestions} index={0} />
			<Button
				fullSized
				color="light"
				className="mt-4 shadow-md"
				onClick={() => {
					console.log(questions);
				}}>
				Add Question
			</Button>
		</div>
	);
};

export default CreateTest;
