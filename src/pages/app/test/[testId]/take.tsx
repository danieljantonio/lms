import { Pagination } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import QuestionDetails from '../../../../components/tests/question-details.tests';
import { validateTestIsOngoing } from '../../../../lib/helpers/date.helpers';
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

	if (isLoading || testIsLoading) return <div>Loading...</div>;
	if (!testData || !data) return <div>Test not found</div>;

	const mutateChange = () => {
		console.log(selectedId);
		setSelected(undefined); // set the selected to
	};

	const onPageChange = (e: number) => {
		// mutate to save students choice if selected is not undefined
		if (selectedId) mutateChange();
		setQuestionNo(e); // set the question number to the new page
	};

	return (
		<div className="flex w-full flex-col text-center">
			<p className="mx-auto mb-10 text-3xl font-semibold">
				{testData.classroom.name} - {testData.name}
			</p>

			<Pagination
				className="mb-10 flex items-center justify-center text-center"
				currentPage={questionNo}
				layout="pagination"
				onPageChange={onPageChange}
				showIcons={true}
				totalPages={testData.questions.length}
			/>

			{data.questions.length >= questionNo && (
				<QuestionDetails selectedAnswer={setSelected} id={data.questions[questionNo - 1]?.questionId || ''} />
			)}
		</div>
	);
};

export default TakeTest;