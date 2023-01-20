import { Card } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import CardIcon from '../../../components/tests/card-icon.tests';
import {
	formatDate,
	validateTestIsOngoing,
	validateTestIsOver,
	validateTestNotStarted,
} from '../../../lib/helpers/date.helpers';
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
					data.ongoingTests.map((test) => <CardIcon test={test} />)
				) : (
					<Card className="mt-4 !bg-gray-100">No Ongoing Tests</Card>
				)}

				<div className="mt-8 text-xl">
					Upcoming Tests {data.upcomingTests && `(${data.upcomingTests.length})`}
				</div>
				{data.upcomingTests.length > 0 ? (
					data.upcomingTests.map((test) => <CardIcon test={test} />)
				) : (
					<Card className="mt-4 !bg-gray-100">No Upcoming Tests</Card>
				)}

				<div className="mt-8 text-xl">Overdue Tests</div>
				{data.overdueTests.length > 0 ? (
					data.overdueTests.map((test) => <CardIcon test={test} />)
				) : (
					<Card className="mt-4 !bg-gray-100">No Overdue Tests</Card>
				)}
			</div>
		</div>
	);
};

export default Tests;
