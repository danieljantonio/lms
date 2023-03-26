import { NextPage } from 'next';
import { useRouter } from 'next/router';
import TestCard from '../../../components/tests/common/test-card.tests';
import useAuth from '../../../lib/hooks/useAuth';
import { trpc } from '../../../lib/trpc';

const Tests: NextPage = () => {
	const router = useRouter();
	const { data, isLoading } = trpc.test.getDashboardData.useQuery(undefined, { refetchOnWindowFocus: false });
	const { role } = useAuth();

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>No Test Found</div>;

	return (
		<div className="flex flex-col">
			<div>Change this to display a table of tests containing proper information</div>
			{/* <div className="text-xl">Tests {data.tests && `(${data.tests.length})`}</div>
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
			)} */}
		</div>
	);
};

export default Tests;
