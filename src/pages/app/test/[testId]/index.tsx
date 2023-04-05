import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../../../lib/trpc';
import date from 'date-and-time';
import StartPrompt from '@/components/tests/common/start-prompt.tests';

type ClassroomQueryProp = {
	testId: string;
};

const TestDetails: NextPage = () => {
	const router = useRouter();
	const { testId } = router.query as ClassroomQueryProp;

	const { data: test, isLoading: fetchingTest } =
		trpc.test.getTestById.useQuery(
			{ testId },
			{ refetchOnWindowFocus: false },
		);
	const { data: hasTaken, isLoading: hasTakenLoading } =
		trpc.studentTest.hasTaken.useQuery(
			{ testId },
			{ refetchOnWindowFocus: false },
		);
	const createStudentTest = trpc.studentTest.create.useMutation({
		onSuccess: () => {
			router.push(`/app/test/${testId}/take`);
		},
	});

	if (fetchingTest) return <div>Loading...</div>;
	if (!test) return <div>Test not found</div>;

	const takeTest = () => {
		createStudentTest.mutate({
			testId: test.id,
			duration: test.duration,
		});
	};

	return (
		<div className="mt-6 flex flex-col gap-4">
			<div className="divider text-xl">Test Details</div>
			<ul className="steps steps-vertical">
				<li data-content="" className="step step-primary">
					{test.classroom.name}: {test.name}
				</li>
				<li
					data-content={test.questions.length}
					className="step step-primary">
					Questions
				</li>
				<li data-content={test.duration} className="step step-primary">
					Minutes Duration
				</li>
				<li data-content="" className="step step-primary">
					Between {date.format(test.startDate, 'DD MMM')}
					{' - '}
					{date.format(test.endDate, 'DD MMM')}
				</li>
			</ul>
			<label
				htmlFor="test-start-prompt"
				className={`btn w-fit ${
					hasTaken || hasTakenLoading ? 'btn-disabled' : ''
				}`}>
				Take Test
			</label>
			<StartPrompt
				testDetails={test}
				onTakeTest={takeTest}
				loading={createStudentTest.isLoading}
			/>
		</div>
	);
};

export default TestDetails;
