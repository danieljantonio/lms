import TestForm from '@/components/tests/test-form.tests';
import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/router';

const ViewTest = () => {
	const router = useRouter();
	const { tid } = router.query as { tid: string };
	const { data: test, isLoading } = trpc.test.getTestById.useQuery(
		{
			testId: tid,
		},
		{ refetchOnWindowFocus: false },
	);

	const onSubmit = (data) => {
		console.log(data);
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="flex flex-col">
			<TestForm test={test} onSubmit={onSubmit} disabled />
		</div>
	);
};

export default ViewTest;
