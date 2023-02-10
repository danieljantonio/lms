import date from 'date-and-time';
import { Button, Card, Pagination } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import QuestionDetails from '../../../../components/tests/question-details.tests';
import { trpc } from '../../../../lib/trpc';

type ClassroomQueryProp = {
	testId: string;
};

const TakeTest: NextPage = () => {
	const [questionNo, setQuestionNo] = useState<number>(1);
	const [selectedId, setSelected] = useState<string>();
	const router = useRouter();
	const { testId } = router.query as ClassroomQueryProp;

	const trpcUtil = trpc.useContext();
	const { data: testData, isLoading: testIsLoading } = trpc.test.getTestById.useQuery({ testId });
	const { data, isLoading } = trpc.studentTest.get.useQuery({ testId });
	const answerQuestion = trpc.studentTest.answer.useMutation({
		onSuccess: (data) => {
			setSelected(undefined); // set the selected to
			setQuestionNo(data.newPage);
			trpcUtil.studentTest.get.invalidate();
		},
	});

	const submitTest = trpc.studentTest.submit.useMutation({
		onSuccess: (success) => {
			if (success) trpcUtil.studentTest.get.invalidate();
		},
	});

	if (isLoading || testIsLoading) return <div>Loading...</div>;

	if (!testData || !data) {
		router.push(`/app/test/${testId}`);
		return null;
	}

	const mutate = (newPage?: number) => {
		if (selectedId)
			answerQuestion.mutate({
				studentTestId: data.id,
				questionId: data.questions[questionNo - 1]?.questionId || '',
				chosenAnswerId: selectedId,
				newPage: newPage || 1,
			});
	};

	if (date.subtract(data.endDate, new Date()).toMilliseconds() < 1 || data.submittedDate) {
		mutate();
		return <Card>Test has ended</Card>;
	}

	const onSubmitTest = () => {
		mutate();
		submitTest.mutate({ id: data.id });
	};

	const onPageChange = (newPage: number) => {
		if (!selectedId) setQuestionNo(newPage);
		mutate(newPage);
	};

	return (
		<div className="flex w-full flex-col text-center">
			<p className="mx-auto text-3xl font-semibold">
				{testData.test.classroom.name} - {testData.test.name}
			</p>

			<div className="my-8 flex gap-6 mx-auto">
				<Card className="max-w-5xl">
					Time Left: {date.subtract(data.endDate, new Date()).toMinutes().toFixed()} minutes
				</Card>
				<Card className="max-w-5xl">
					Questions left: {data.questions.filter((q) => q.chosenAnswerId).length}/{data.questions.length}
				</Card>
			</div>

			<Pagination
				className="mb-10 flex items-center justify-center text-center"
				currentPage={questionNo}
				layout="pagination"
				onPageChange={onPageChange}
				showIcons={true}
				totalPages={testData.test.questions.length}
			/>

			{answerQuestion.isLoading ? (
				<div>Loading...</div>
			) : (
				data.questions.length >= questionNo && (
					<div className="relative">
						<QuestionDetails
							studentTestId={data.id}
							selectedAnswer={setSelected}
							questionId={data.questions[questionNo - 1]?.questionId || ''}
						/>
						<div className="max-w-screen-md mx-auto">
							{questionNo === data.questions.length && (
								<Button className="float-right mt-6" onClick={onSubmitTest}>
									Save & Submit
								</Button>
							)}
						</div>
					</div>
				)
			)}
		</div>
	);
};

export default TakeTest;
