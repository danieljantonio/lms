import { Button } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { formatDate, validateTestIsOngoing } from '../../../lib/helpers/date.helpers';
import { trpc } from '../../../lib/trpc';

type ClassroomQueryProp = {
	testId: string;
};

const TestDetails: NextPage = () => {
	const router = useRouter();
	const { testId } = router.query as ClassroomQueryProp;

	const { data, isLoading } = trpc.test.getTestById.useQuery({ testId });

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Test not found</div>;

	const testIsValid = validateTestIsOngoing(data.startDate, data.endDate);

	return (
		<div>
			<div className="mb-6 text-2xl">{data?.name}</div>
			<div>
				<p>Duration: {data.duration}</p>
				<p>Start Date: {formatDate(data.startDate)}</p>
				<p>End Date: {formatDate(data.endDate)}</p>
				<p>Questions: {data.questions.length}</p>
				<Button disabled={!testIsValid} onClick={() => router.push(`/app/test/take/${testId}`)}>
					Take Test
				</Button>
			</div>
		</div>
	);
};

export default TestDetails;
