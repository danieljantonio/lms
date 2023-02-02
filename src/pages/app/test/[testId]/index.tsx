import { Button, Card } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import StartPrompt from '../../../../components/tests/start-prompt.tests';
import { formatDate, validateTestIsOngoing } from '../../../../lib/helpers/date.helpers';
import { trpc } from '../../../../lib/trpc';

type ClassroomQueryProp = {
	testId: string;
};

const TestDetails: NextPage = () => {
	const [modalState, toggleModal] = useState<boolean>(false);

	const router = useRouter();
	const { testId } = router.query as ClassroomQueryProp;

	const { data, isLoading } = trpc.test.getTestById.useQuery({ testId });
	const takeTest = trpc.studentTest.create.useMutation({
		onSuccess: () => {
			router.push(`/app/test/${testId}/take`);
		},
	});

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Test not found</div>;

	const testIsValid = validateTestIsOngoing(data.startDate, data.endDate);

	const onStartTest = () => {
		takeTest.mutate({ testId, classroomId: data.classroomId });
	};

	return (
		<div className="mt-6">
			<Card>
				<div className="mb-6 text-2xl">{data?.name}</div>
				<div>
					<p>Duration: {data.duration} minutes</p>
					<p>Start Date: {formatDate(data.startDate)}</p>
					<p>End Date: {formatDate(data.endDate)}</p>
					<p>Questions: {data.questions.length}</p>
					<StartPrompt
						isOpen={modalState}
						toggle={toggleModal}
						onStartTest={onStartTest}
						testDetails={data}
					/>
					<Button className="mt-8" disabled={!testIsValid} onClick={() => toggleModal(true)}>
						Take Test
					</Button>
				</div>
			</Card>
		</div>
	);
};

export default TestDetails;
