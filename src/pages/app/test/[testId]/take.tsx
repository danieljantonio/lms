import date from 'date-and-time';
import { Card, Pagination } from 'flowbite-react';
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

	const { data: testData, isLoading: testIsLoading } = trpc.test.getTestById.useQuery({ testId });
	const { data, isLoading } = trpc.studentTest.get.useQuery({ testId });
	const answerQuestion = trpc.studentTest.answer.useMutation({
		onSuccess: (data) => {
			setSelected(undefined); // set the selected to
			setQuestionNo(data.newPage);
		},
	});

	if (isLoading || testIsLoading) return <div>Loading...</div>;

	if (!testData || !data) {
		router.push(`/app/test/${testId}`);
		return null;
	}

	if (date.subtract(data.endDate, new Date()).toMilliseconds() < 1) {
		// TODO: mutate changes - then end test
		return <Card>Test has ended</Card>;
	}

	const onPageChange = (e: number) => {
		// mutate to save students choice if selected is not undefined
		if (selectedId) {
			answerQuestion.mutate({
				studentTestId: data.id,
				questionId: data.questions[questionNo - 1]?.questionId || '',
				chosenAnswerId: selectedId,
				newPage: e,
			});
		} else {
			setQuestionNo(e); // set the question number to the new page
		}
	};

	return (
		<div className="flex w-full flex-col text-center">
			<p className="mx-auto mb-10 text-3xl font-semibold">
				{testData.test.classroom.name} - {testData.test.name}
			</p>

			<Card>Time Left: {date.subtract(data.endDate, new Date()).toMinutes().toFixed()} minutes</Card>

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
					<QuestionDetails
						studentTestId={data.id}
						selectedAnswer={setSelected}
						questionId={data.questions[questionNo - 1]?.questionId || ''}
					/>
				)
			)}
		</div>
	);
};

export default TakeTest;
