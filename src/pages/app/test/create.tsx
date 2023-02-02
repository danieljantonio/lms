import { Button, Card, Label, Select, TextInput } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import QuestionInput from '../../../components/tests/question-input.tests';
import { trpc } from '../../../lib/trpc';
import { QuestionProps } from '../../../types/tests';

const CreateTest: NextPage = () => {
	// Hooks
	const [loading, setLoading] = useState<boolean>(false);
	const [questions, setQuestions] = useState<QuestionProps[]>([]);
	const [testName, setTestName] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [classroomId, setClassroomId] = useState<string>('');
	const [testDuration, setTestDuration] = useState<number>(0);
	const router = useRouter();

	// tRPC
	const { data: classrooms, isLoading: loadingClassroom } = trpc.classroom.getUserClassrooms.useQuery();

	const createTest = trpc.test.create.useMutation({
		onSuccess(data) {
			router.push(`/app/test/${data.id}`);
		},
	});

	// Methods
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

	const isDisabled = () => {
		return (
			createTest.isLoading ||
			questions.length === 0 ||
			startDate === '' ||
			endDate === '' ||
			classroomId === '' ||
			testDuration === 0
		);
	};

	const create = () => {
		if (isDisabled()) return;
		createTest.mutate({
			testName,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			questions,
			classroomId,
			duration: testDuration,
		});
	};

	return (
		<div className="mx-auto max-w-screen-xl">
			<Card>
				<p className="text-xl">Create New Test</p>
				<div className="flex w-full flex-col justify-between gap-6 lg:flex-row">
					<div className="lg:w-2/3">
						<div>
							<Label>Test Name</Label>
							<TextInput onChange={(e) => setTestName(e.target.value)} placeholder="Test Name" />
						</div>
						<div className="mt-4">
							<Label>Classroom</Label>
							<Select id="classrooms" onChange={(e) => setClassroomId(e.target.value)}>
								<option value="">Select a classroom</option>
								{!loadingClassroom &&
									classrooms?.map((classroom) => (
										<option value={classroom.classroom.id}>{classroom.classroom.name}</option>
									))}
							</Select>
						</div>
					</div>
					<div className="lg:w-1/3">
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
						<div className="mt-4">
							<Label>Duration (Minutes):</Label>
							<TextInput
								min={30}
								onChange={(e) => setTestDuration(parseInt(e.target.value))}
								placeholder="Test Duration (in minutes)"
								type="number"
							/>
						</div>
					</div>
				</div>
			</Card>

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
				disabled={createTest.isLoading}
				fullSized
				color="light"
				className="mt-4 shadow-md"
				onClick={() => {
					console.log(questions);
					addNewQuestion();
				}}>
				Add Question
			</Button>
			<Button onClick={create} disabled={isDisabled()} type="submit" fullSized className="mt-4">
				Create Test
			</Button>
		</div>
	);
};

export default CreateTest;
