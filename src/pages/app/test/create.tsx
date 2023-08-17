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

const CreateTest = () => {
	const router = useRouter();

	const { query } = router;
	const { classroom: classroomId } = query;

	const createTest = trpc.test.create.useMutation({
		onSuccess: (test) => {
			router.push(`/app/test/${test.id}`);
		},
	});

	if (!classroomId) {
		return <div>Missing classroom data</div>;
	}

	const onSubmit = (formData: TestBaseDto) => {
		createTest.mutate({ ...formData, classroomId: classroomId as string });
	};

	return <TestForm onSubmit={onSubmit} />;
};

export default CreateTest;
