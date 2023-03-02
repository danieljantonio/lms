import { Button, Card } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import StartPrompt from '../../../../components/tests/common/start-prompt.tests';
import { formatDate, validateTestIsOver } from '../../../../lib/helpers/date.helpers';
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

	const { test, existingTest } = data;

	const getButtonMessage = () => {
		if (existingTest) {
			if (validateTestIsOver(existingTest.endDate)) return { disabled: true, text: 'Test Over' };
			if (existingTest.submittedDate) return { disabled: true, text: 'Test Submitted' };
			return { disabled: false, text: 'Continue Test' };
		}
		if (validateTestIsOver(test.endDate)) return { disabled: true, text: 'Test overdue' };
		return { disabled: false, text: 'Take test' };
	};

	const onStartTest = () => {
		takeTest.mutate({ testId, classroomId: test.classroomId });
	};

	const onButtonClick = () => {
		if (existingTest) router.push(`/app/test/${existingTest.testId}/take`);
		else toggleModal(true);
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
					<Button className="mt-8" disabled={getButtonMessage().disabled} onClick={onButtonClick}>
						{getButtonMessage().text}
					</Button>
				</div>
			</Card>
		</div>
	);
};

export default TestDetails;
