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
			redirectPage();
		},
	});

	const redirectPage = () => {
		router.push(`/app/test/${testId}/take`);
	};

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Test not found</div>;

	const { test, existingTest } = data;
	console.log(existingTest);

	const testIsValid = validateTestIsOngoing(test.startDate, test.endDate);

	const onStartTest = () => {
		takeTest.mutate({ testId, classroomId: test.classroomId });
	};

	return (
		<div className="mt-6">
			<Card>
				<div className="mb-6 text-2xl">{test?.name}</div>
				<div>
					<p>Duration: {test.duration} minutes</p>
					<p>Start Date: {formatDate(test.startDate)}</p>
					<p>End Date: {formatDate(test.endDate)}</p>
					<p>Questions: {test.questions.length}</p>
					<StartPrompt
						isOpen={modalState}
						toggle={toggleModal}
						onStartTest={onStartTest}
						testDetails={test}
					/>
					<Button className="mt-8" disabled={!testIsValid} onClick={() => toggleModal(true)}>
						{existingTest ? 'Continue Test' : 'Take Test'}
					</Button>
				</div>
			</Card>
		</div>
	);
};

export default TestDetails;
