import QuestionInput from '@/components/tests/create/question-input.';
import TestForm from '@/components/tests/test-form.tests';
import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/router';

type TestBaseDto = {
	name: string;
	startDate: string;
	endDate: string;
	duration: number;
	passcode: string;
};

const EditTest = () => {
	const router = useRouter();
	const { tid } = router.query as { tid: string };
	const { data: test, isLoading } = trpc.test.getTestById.useQuery(
		{
			testId: tid,
		},
		{ refetchOnWindowFocus: false },
	);

	if (isLoading) return <div>Loading...</div>;

	const onSubmit = (formData) => {
		console.log(formData);
	};

	return (
		<div className="mx-auto max-w-screen-xl">
			<TestForm test={test} onSubmit={onSubmit} />
			{test?.questions.map((question) => (
				<QuestionInput question={question} key={question.id} />
			))}
		</div>
	);
};

export default EditTest;
