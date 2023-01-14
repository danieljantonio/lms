import { Button, Card, Label, TextInput } from 'flowbite-react';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import QuestionInput from '../../../components/tests/question-input.tests';
import { QuestionProps } from '../../../types/tests';

const CreateTest: NextPage = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [questions, setQuestions] = useState<QuestionProps[]>([]);
	const [testName, setTestName] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');

	const addNewQuestion = async () => {
		setLoading(true);
		let _questions = questions;
		_questions.push({
			question: '',
			choices: [],
		});
		await setQuestions(_questions);
		setLoading(false);
	};

	const removeQuestion = async (index: number) => {
		setLoading(true);
		let _questions = questions;
		_questions.splice(index, 1);
		await setQuestions(_questions);
		setLoading(false);
	};

	const updateQuestion = async (newQuestion: QuestionProps, index: number) => {
		let _questions = questions;
		_questions[index] = newQuestion;
		await setQuestions(_questions);
	};

	const log = () => {
		if (startDate === '' || endDate === '') return;
		console.log({ testName, startDate, endDate, questions });
	};

	return (
		<div className="mx-auto max-w-screen-xl">
			<Card>
				<p className="text-xl">Create New Test</p>
				<div className="flex w-full flex-col justify-between gap-6 lg:flex-row">
					<div className="lg:w-2/3">
						<Label>Test Name</Label>
						<TextInput onChange={(e) => setTestName(e.target.value)} placeholder="Test Name" />
					</div>
					<div className="gap-6 lg:w-1/3">
						<div>
							<Label>Start Date</Label>
							<TextInput
								onChange={(e) => setStartDate(e.target.value)}
								placeholder="Test Name"
								type="datetime-local"
							/>
						</div>
						<div className="mt-4">
							<Label>End Date</Label>
							<TextInput
								onChange={(e) => setEndDate(e.target.value)}
								placeholder="Test Name"
								type="datetime-local"
							/>
						</div>
					</div>
				</div>
			</Card>

			<Button onClick={log} fullSized className="mt-4">
				Log
			</Button>

			{loading ? (
				<div>Loading...</div>
			) : (
				questions.map((question, index) => (
					<QuestionInput
						updateQuestion={(question: QuestionProps) => {
							updateQuestion(question, index);
						}}
						index={index}
						data={question}
						removeQuestion={() => {
							removeQuestion(index);
						}}
					/>
				))
			)}

			<Button
				fullSized
				color="light"
				className="mt-4 shadow-md"
				onClick={() => {
					console.log(questions);
					addNewQuestion();
				}}>
				Add Question
			</Button>
		</div>
	);
};

export default CreateTest;
