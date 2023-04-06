import { trpc } from '@/lib/trpc';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

type ClassroomQueryProp = {
	testId: string;
};

const TakeTest: NextPage = () => {
	const router = useRouter();
	const { testId } = router.query;

	const { data, isLoading } = trpc.studentTest.get.useQuery(
		{
			testId: testId as string,
		},
		{ refetchOnWindowFocus: false },
	);

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Failed to fetch test data</div>;

	return (
		<div className="flex w-full flex-col text-center">
			<div>Test Name</div>
			<p className="mx-auto text-3xl font-semibold">Take Test</p>
			<RenderQuestion questionOrder={1} studentTestId={data.id} />
		</div>
	);
};

type RenderQuestionProps = {
	questionOrder: number;
	studentTestId: string;
};

const RenderQuestion = ({
	questionOrder,
	studentTestId,
}: RenderQuestionProps) => {
	const { data, isLoading } = trpc.studentTest.getQuestion.useQuery({
		questionOrder,
		studentTestId,
	});

	if (!isLoading || !data)
		return (
			<div className="card border w-full h-56">
				<div className="loading m-auto">Loading...</div>
			</div>
		);

	return (
		<div className="card border">
			<div className="card-body"></div>
		</div>
	);
};

export default TakeTest;
