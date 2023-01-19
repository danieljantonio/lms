import { Card } from 'flowbite-react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '../../../lib/hooks/useAuth';
import { trpc } from '../../../lib/trpc';

const Tests: NextPage = () => {
	const router = useRouter();
	const { data, isLoading } = trpc.test.getTestDetails.useQuery();
	const { role } = useAuth();

	if (isLoading) return <div>Loading...</div>;

	console.log(data);

	return (
		<div className="flex flex-col">
			<div className="flex gap-8">
				{role !== 'STUDENT' && (
					<Card
						className="w-44 items-center hover:cursor-pointer hover:bg-gray-100"
						onClick={() => router.push('/app/test/create')}>
						Create New Test
					</Card>
				)}
				<Card className="w-44 items-center">{isLoading ? 'Loading' : `${data?.activeTests} Active Tests`}</Card>
				<Card className="w-44 items-center">{isLoading ? 'Loading' : `${data?.totalTest} Total Tests`}</Card>
			</div>
			<div className="mt-6">
				{data?.tests?.map((test) => {
					return (
						<Card className="mt-4">
							<div className="flex justify-between">
								<p className="my-auto">
									{test.name} - {test.classroom?.name}
								</p>
								<div className="text-right">
									<p>
										Starts: {test.startDate.toLocaleDateString('en-GB')} -
										{test.startDate.toLocaleTimeString()}
									</p>
									<p>
										Due: {test.endDate.toLocaleDateString('en-GB')} -{' '}
										{test.endDate.toLocaleTimeString()}
									</p>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
};

export default Tests;
