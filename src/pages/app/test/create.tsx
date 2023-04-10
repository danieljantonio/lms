import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import QCInputRequiredModal from '@/components/tests/common/qc-input-required.modal';
import QuestionInput from '@/components/tests/create/question-input.tests';
import { trpc } from '@/lib/trpc';
import { QuestionProps } from '@/types/tests';

const CreateTest: NextPage = () => {
	// Hooks
	const [loading, setLoading] = useState<boolean>(false);
	const [questions, setQuestions] = useState<QuestionProps[]>([]);
	const [testName, setTestName] = useState<string>('');
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [testDuration, setTestDuration] = useState<number>(90);
	const [modalShow, setModalShow] = useState<boolean>(false);
	const router = useRouter();

	const { query } = router;
	const { classroom: classroomId = '', code: classroomCode = '' } = query;

	// tRPC
	const { data: classrooms, isLoading: loadingClassroom } =
		trpc.classroom.getClassrooms.useQuery(undefined, {
			refetchOnWindowFocus: false,
		});

	const createTest = trpc.test.create.useMutation({
		onSuccess(data) {
			router.push(`/app/test/${data.id}`);
		},
	});

	// Methods
	const addNewQuestion = async () => {
		setLoading(true);
		const _questions = questions;
		_questions.push({
			question: '',
			choices: [],
		});
		await setQuestions(_questions);
		setLoading(false);
	};

	const removeQuestion = async (index: number) => {
		setLoading(true);
		const _questions = questions;
		_questions.splice(index, 1);
		await setQuestions(_questions);
		setLoading(false);
	};

	const updateQuestion = async (
		newQuestion: QuestionProps,
		index: number,
	) => {
		const _questions = questions;
		_questions[index] = newQuestion;
		await setQuestions(_questions);
	};

	const isDisabled = () => {
		return (
			createTest.isLoading ||
			testName === '' ||
			questions.length === 0 ||
			!startDate ||
			!endDate ||
			testDuration === 0
		);
	};

	const create = () => {
		if (isDisabled()) return;

		const allowCreate = questions.every(
			(q) =>
				q.question !== '' &&
				q.choices.some((c) => c.isCorrect) &&
				q.choices.every((c) => c.answer !== ''),
		);

		if (!allowCreate) {
			setModalShow(true);
			return;
		}

		createTest.mutate({
			testName,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			questions,
			classroomId: classroomId as string,
			duration: testDuration,
		});
	};

	return (
		<div className="mx-auto max-w-screen-xl">
			<div className="card border">
				<div className="card-body">
					<p className="card-title">Create New Test</p>
					<div className="flex flex-wrap">
						<OptionsInput label="Test Name">
							<input
								className="input input-bordered w-full"
								placeholder="Ujian Akhir Semester"
								onChange={(e) => setTestName(e.target.value)}
							/>
						</OptionsInput>
						<OptionsInput label="Classroom">
							<input
								className="input input-bordered w-full"
								disabled
								value={classroomCode}
								readOnly
							/>
						</OptionsInput>
						<OptionsInput label="Start Date">
							<input
								className="input input-bordered w-full"
								type="datetime-local"
								value={startDate.toISOString().slice(0, 16)}
								onChange={(e) =>
									setStartDate(new Date(e.target.value))
								}
							/>
						</OptionsInput>
						<OptionsInput label="End Date">
							<input
								value={endDate.toISOString().slice(0, 16)}
								type="datetime-local"
								className="input input-bordered w-full"
								onChange={(e) =>
									setEndDate(new Date(e.target.value))
								}
							/>
						</OptionsInput>
						<OptionsInput label="Duration">
							<input
								className="input input-bordered w-full"
								value={testDuration}
								type="number"
								onChange={(e) =>
									setTestDuration(parseInt(e.target.value))
								}
							/>
						</OptionsInput>
					</div>
				</div>
			</div>

			{loading ? (
				<div>Loading...</div>
			) : (
				questions.map((question, index) => (
					<QuestionInput
						key={index}
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

			<QCInputRequiredModal
				show={modalShow}
				setClose={() => setModalShow(false)}
			/>

			<button
				disabled={createTest.isLoading}
				onClick={() => {
					console.log(questions);
					addNewQuestion();
				}}
				className="btn mt-4 border border-inherit btn-ghost w-full">
				Add Question
			</button>

			<button
				className="btn btn-primary w-full mt-4"
				onClick={create}
				disabled={isDisabled()}>
				Create Test
			</button>
		</div>
	);
};

export default CreateTest;

type OptionsInputProps = {
	label: string;
	children: ReactNode;
};

const OptionsInput = ({ label, children }: OptionsInputProps) => {
	return (
		<div className="form-control w-full md:w-1/2">
			<div className="px-2">
				<label
					htmlFor={label.toLowerCase().replace(' ', '-')}
					className="label !pl-0">
					<span className="label-text">{label}</span>
				</label>
				{children}
			</div>
		</div>
	);
};
