import { PlusSmallIcon } from '@heroicons/react/24/solid';
import { Button, Card } from 'flowbite-react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import useAuth from '../../lib/hooks/useAuth';
import { trpc } from '../../lib/trpc';
import TestCard from '../tests/common/test-card.tests';

const ClassTests: FC = () => {
	const router = useRouter();
	const { code } = router.query;
	const { data, isLoading } = trpc.test.getDashboardData.useQuery(undefined, { refetchOnWindowFocus: false });
	const { role } = useAuth();

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>No Test Found</div>;

	return (
		<div className="flex flex-col">
			{role !== 'STUDENT' && (
				<div className="flex gap-8 mb-4">
					<Button
						onClick={() => router.push(`/app/test/create?classroom=${code}`)}
						className="absolute bottom-5 right-5">
						Create New Test
					</Button>
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
