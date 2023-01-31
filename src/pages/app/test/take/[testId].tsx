import { Card, Pagination } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import CustomPagination from '../../../../components/tests/pagination.tests';
import { validateTestIsOngoing } from '../../../../lib/helpers/date.helpers';
import { trpc } from '../../../../lib/trpc';

type ClassroomQueryProp = {
	testId: string;
};

type Props = {
	selected?: boolean;
	value: string;
	onClick: (value: string) => void;
};

const ChoiceCard: FC<PropsWithChildren<Props>> = ({ children, selected = false, value, onClick }) => {
	return (
		<Card
			onClick={() => onClick(value)}
			className={`${
				selected && '!bg-green-200'
			} mx-auto mt-4 max-w-screen-md hover:cursor-pointer hover:bg-gray-100`}>
			<p>{children}</p>
		</Card>
	);
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
			<div className="mx-auto mb-6 text-2xl">
				{data.classroom.name} - {data.name}
			</div>

			<div className="my-6 flex items-center justify-center text-center">
				<Pagination
					currentPage={questionNo}
					layout="pagination"
					onPageChange={onPageChange}
					showIcons={true}
					totalPages={data.questions.length}
					previousLabel="Previous"
					nextLabel="Next"
				/>
			</div>

			<div>
				<p className="text-2xl">Question: {data.questions[questionNo - 1]?.question}</p>
			</div>

			<div>
				{[
					{ id: '1asv2', answer: 'First' },
					{ id: '2asv2', answer: 'Second' },
					{ id: '3asv2', answer: 'Third' },
				].map((choice, index) => (
					<ChoiceCard value={choice.id} selected={choice.id === selectedId} onClick={onSelectChoice}>
						{choice.answer}
					</ChoiceCard>
				))}
			</div>

			{/* <div>
				<p>Duration: {data.duration}</p>
				<p>Start Date: {data.startDate.toLocaleDateString('en-GB')}</p>
				<p>End Date: {data.endDate.toLocaleDateString('en-GB')}</p>
				<p>Questions: {data.questions.length}</p>
				<Button disabled={!testIsValid} onClick={() => router.push(`/app/test/take/${testId}`)}>
					Take Test
				</Button>
			</div> */}
		</div>
	) : null;
};

export default TakeTest;
