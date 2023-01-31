import { Pagination } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ChoiceCard from '../../../../components/tests/choice-card.tests';
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

	const { data, isLoading } = trpc.test.getTestById.useQuery({ testId });

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Test not found</div>;

	const testIsValid = validateTestIsOngoing(data.startDate, data.endDate);

	if (!testIsValid) router.push('/app/test');

	const mutateChange = (e) => {
		console.log(selectedId);
		setSelected(undefined); // set the selected to
	};

	const onPageChange = (e: number) => {
		// mutate to save students choice if selected is not undefined
		if (selectedId) mutateChange(e);
		setQuestionNo(e); // set the question number to the new page
	};

	const onSelectChoice = (e: string) => {
		setSelected(e);
	};

	return testIsValid ? (
		<div className="flex w-full flex-col text-center">
			<p className="mx-auto mb-10 text-3xl font-semibold">
				{data.classroom.name} - {data.name}
			</p>

			<Pagination
				className="mb-10 flex items-center justify-center text-center"
				currentPage={questionNo}
				layout="pagination"
				onPageChange={onPageChange}
				showIcons={true}
				totalPages={data.questions.length}
			/>

			<p className="text-2xl">Question: {data.questions[questionNo - 1]?.question}</p>

			<div className="my-4">
				{[
					{ id: '1asv2', answer: 'First' },
					{ id: '2asv2', answer: 'Second' },
					{ id: '3asv2', answer: 'Third' },
				].map((choice, index) => (
					<ChoiceCard
						key={index}
						value={choice.id}
						selected={choice.id === selectedId}
						onClick={onSelectChoice}>
						{choice.answer}
					</ChoiceCard>
				))}
			</div>
		</div>
	) : null;
};

export default TakeTest;
