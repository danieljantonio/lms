import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { validateTestNotStarted } from '../../../../lib/helpers/date.helpers';
import { trpc } from '../../../../lib/trpc';

type ClassroomQueryProp = {
	testId: string;
};

const EditTest: NextPage = () => {
	const router = useRouter();
	const { testId } = router.query as ClassroomQueryProp;

	const { data, isLoading } = trpc.test.getTestById.useQuery({ testId });

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Test not found</div>;

	const testIsEditable = validateTestNotStarted(data.startDate);

	if (!testIsEditable) router.push('/app/test');

	return testIsEditable ? <div>Edit Test</div> : null;
};

export default EditTest;
