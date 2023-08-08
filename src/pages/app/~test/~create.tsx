import QCInputRequiredModal from '@/components/tests/common/qc-input-required.modal';
import QuestionInput from '@/components/tests/create/question-input.tests';
import { uploadPresignedImage } from '@/lib/helpers/common.helpers';
import { trpc } from '@/lib/trpc';
import type { QuestionProps } from '@/types/tests';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useState } from 'react';

const CreateTest: NextPage = () => {
	// Hooks
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);

	// Form Hooks
	const [questions, setQuestions] = useState<QuestionProps[]>([]);
	const [testName, setTestName] = useState<string>('');
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [testDuration, setTestDuration] = useState<number>(90);
	const [modalShow, setModalShow] = useState<boolean>(false);

	const { query } = router;
	const { classroom: classroomId = '', code: classroomCode = '' } = query;

	// tRPC
	const createTest = trpc.test.create.useMutation();

	const { mutateAsync: getPresignedUrl } =
		trpc.s3.getStandardUploadPresignedUrl.useMutation();

	// Methods
	const addNewQuestion = async () => {
		setLoading(true);
		const _questions = questions;
		_questions.push({
			questionNo: _questions.length + 1,
			question: '',
			imageFile: undefined,
			choices: [],
			hasImage: false,
			isEssay: false,
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
		setLoading(true);
		const _questions = questions;
		_questions[index] = newQuestion;
		await setQuestions(_questions);
		setLoading(false);
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

	const filterQuestions = () => {
		// non essay questions should have its choices validated.
		const nonEssayQuestions = questions.filter((q) => !q.isEssay);
		const essayQuestions = questions.filter((q) => q.isEssay);

		// neq stands for (n)on (e)ssay (q)uestions
		const neqValidate = nonEssayQuestions.every(
			(q) =>
				q.question !== '' &&
				q.choices.some((c) => c.isCorrect) &&
				q.choices.every((c) => c.answer !== ''),
		);

		// eq stands for (e)ssay (q)uestions
		const eqValidate = essayQuestions.every((q) => q.question !== '');

		if (!neqValidate || !eqValidate) {
			setModalShow(true);
			return false;
		}

		return true;
	};

	const create = () => {
		if (isDisabled()) return;

		if (!filterQuestions()) return;

		createTest
			.mutateAsync({
				testName,
				startDate: new Date(startDate),
				endDate: new Date(endDate),
				questions,
				classroomId: classroomId as string,
				duration: testDuration,
			})
			.then((data) => {
				const asdf = data.questions.map((question) => {
					if (question.hasImage) {
						return getPresignedUrl({
							key: `test-template/${question.testTemplateId}/${question.id}`,
						}).then((url) => {
							return uploadPresignedImage(
								url,
								questions[question.questionNo - 1]?.imageFile,
							);
						});
					}
				});
				Promise.all(asdf).then(() => {
					console.log('All of the images has been uploaded');
					router.push(`/app/test/${data.id}`);
				});
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
