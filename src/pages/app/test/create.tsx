import { Button, Card, Label, TextInput } from 'flowbite-react';
import { NextPage } from 'next';
import { useState } from 'react';
import QuestionInput from '../../../components/tests/question-input.tests';
import { QuestionProps } from '../../../types/tests';

const CreateTest: NextPage = () => {
	const initQuestion: QuestionProps = {
		question: 'What is the meaning of life?',
		choices: [
			{
				answer: '42',
				isCorrectAnswer: false,
			},
			{
				answer: 'Jesus',
				isCorrectAnswer: true,
			},
			{
				answer: 'Satisfaction',
				isCorrectAnswer: false,
			},
			{
				answer: 'Fulfillment',
				isCorrectAnswer: false,
			},
		],
	};

	const [questions, setQuestions] = useState<QuestionProps[]>([initQuestion]);
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

			{questions.map((question, index) => (
				<QuestionInput updateQuestion={() => {}} index={index} data={question} />
			))}

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
