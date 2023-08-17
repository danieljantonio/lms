import QuestionInput from '@/components/tests/create/question-input.';
import TestForm from '@/components/tests/test-form.tests';
import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/router';

const EditTest = () => {
	const router = useRouter();
	const { tid } = router.query as { tid: string };
	const { data: test, isLoading } = trpc.test.getTestById.useQuery(
		{
			testId: tid,
		},
		{ refetchOnWindowFocus: false },
	);

	const { data: questions, isLoading: questionLoading } =
		trpc.question.getQuestions.useQuery(
			{
				testId: tid,
			},
			{ refetchOnWindowFocus: false },
		);

	if (isLoading || questionLoading) return <div>Loading...</div>;

	const onSubmit = (formData: any) => {
		console.log(formData);
	};

	const onRemove = (id: string) => {
		console.log('remove', id);
	};

	return (
		<div>
			<TestForm test={test} onSubmit={onSubmit} />
			{questions?.map((question, index) => (
				<QuestionInput
					index={index}
					question={question}
					key={question.id}
					onRemove={onRemove}
				/>
			))}
		</div>
	);
};

export default EditTest;
