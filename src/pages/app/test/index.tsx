import { Card } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import TestCard from '../../../components/tests/test-card.tests';
import useAuth from '../../../lib/hooks/useAuth';
import { trpc } from '../../../lib/trpc';

const Tests: NextPage = () => {
	const router = useRouter();
	const { data, isLoading } = trpc.test.getTests.useQuery();
	const { role } = useAuth();

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>No Test Found</div>;

	return (
		<div className="flex flex-col">
			<div className="flex gap-8">
				{role !== 'STUDENT' && (
					<Card
						className="w-44 items-center hover:cursor-pointer hover:bg-gray-200"
						onClick={() => router.push('/app/test/create')}>
						Create New Test
					</Card>
				)}
			</div>
			<div className="mt-6">
				<div className="mt-4 text-xl">Ongoing Tests {data.ongoingTests && `(${data.ongoingTests.length})`}</div>
				{data.ongoingTests.length > 0 ? (
					data.ongoingTests.map((test) => <TestCard test={test} />)
				) : (
					<div className="mt-4 w-full rounded-md border p-10 text-center">No Ongoing Tests</div>
				)}

				<div className="mt-8 text-xl">
					Upcoming Tests {data.upcomingTests && `(${data.upcomingTests.length})`}
				</div>
				{data.upcomingTests.length > 0 ? (
					data.upcomingTests.map((test) => <TestCard test={test} />)
				) : (
					<div className="mt-4 w-full rounded-md border p-10 text-center">No Upcoming Tests</div>
				)}

				<div className="mt-8 text-xl">Overdue Tests</div>
				{data.overdueTests.length > 0 ? (
					data.overdueTests.map((test) => <TestCard overdue test={test} />)
				) : (
					<div className="mt-4 w-full rounded-md border p-10 text-center">No Overdue Tests</div>
				)}
			</div>
		</div>
	);
};

export default Tests;
