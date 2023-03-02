import { Card } from 'flowbite-react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import useAuth from '../../lib/hooks/useAuth';
import { trpc } from '../../lib/trpc';
import TestCard from '../tests/test-card.tests';

const ClassTests: FC = () => {
	const router = useRouter();
	const { data, isLoading } = trpc.test.getDashboardData.useQuery();
	const { role } = useAuth();

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>No Test Found</div>;

	return (
		<div className="flex flex-col">
			{role !== 'STUDENT' && (
				<div className="flex gap-8">
					<Card
						className="w-44 items-center hover:cursor-pointer hover:bg-gray-200"
						onClick={() => router.push('/app/test/create')}>
						Create New Test
					</Card>
				</div>
			)}
			<div className="text-xl">Tests {data.tests && `(${data.tests.length})`}</div>
			{data.tests.length > 0 ? (
				data.tests.map((test) => <TestCard key={test.id} test={test} />)
			) : (
				<div className="mt-4 w-full rounded-md border p-10 text-center">No Upcoming Tests</div>
			)}

			<div className="mt-4 text-xl">Completed {data.doneTests && `(${data.doneTests.length})`}</div>
			{data.doneTests.length > 0 ? (
				data.doneTests.map(
					(test) =>
						test.test &&
						test.score && <TestCard overdue key={test.id} grade={test.score} test={test.test} />,
				)
			) : (
				<div className="mt-4 w-full rounded-md border p-10 text-center">No Ongoing Tests</div>
			)}
		</div>
	);
};

export default ClassTests;
