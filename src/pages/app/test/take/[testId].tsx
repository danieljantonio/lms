import { Pagination } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CustomPagination from '../../../../components/tests/pagination.tests';
import { validateTestIsOngoing } from '../../../../lib/helpers/date.helpers';
import { trpc } from '../../../../lib/trpc';

type ClassroomQueryProp = {
	testId: string;
};

const TakeTest: NextPage = () => {
	const [questionNo, setQuestionNo] = useState<number>(1);
	const router = useRouter();
	const { testId } = router.query as ClassroomQueryProp;

	const { data, isLoading } = trpc.test.getTestById.useQuery({ testId });

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Test not found</div>;

	const testIsValid = validateTestIsOngoing(data.startDate, data.endDate);

	if (!testIsValid) router.push('/app/test');

	const onPageChange = (e: number) => {
		setQuestionNo(e);
	};

	return testIsValid ? (
		<div className="flex w-full flex-col text-center">
			<div className="mx-auto mb-6 text-2xl">
				{data.classroom.name} - {data.name}
			</div>

			<div className="my-6 flex items-center justify-center text-center">
				<CustomPagination
					currentPage={questionNo}
					onPageChange={onPageChange}
					totalPages={data.questions.length}
				/>
			</div>
			<div className="my-6 flex items-center justify-center text-center">
				<Pagination
					currentPage={questionNo}
					layout="pagination"
					onPageChange={onPageChange}
					showIcons={true}
					totalPages={data.questions.length}
					previousLabel="Go back"
					nextLabel="Go forward"
				/>
			</div>

			<div>
				<p className="text-2xl">{data.questions[questionNo - 1]?.question}</p>
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
