import TestForm from '@/components/tests/test-form.tests';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
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
			<TestForm
				test={test}
				onSubmit={onSubmit}
				disabled
				action={
					<Link
						href={`/app/test/${tid}/edit`}
						className="btn btn-primary mx-2 mt-4 float-right">
						Edit
					</Link>
				}
			/>
		</div>
	);
};

export default ViewTest;
