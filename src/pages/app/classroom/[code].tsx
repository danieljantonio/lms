import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../../lib/trpc';

type ClassroomQueryProp = {
	code: string;
};

const Classroom: NextPage = () => {
	const router = useRouter();
	const { code } = router.query as ClassroomQueryProp;

	const { data, isLoading } = trpc.classroom.getClassroomData.useQuery({ code: code.toUpperCase() });

	if (isLoading) return <div>Loading...</div>;
	console.log(data);

	return (
		<div>
			<div className="mb-6 text-2xl">
				{`${data?.name}`.toUpperCase()} - {data?.teacher?.name}
			</div>
			<div>
				School: {data?.school.name} ({data?.school.code})
			</div>
		</div>
	);
};

export default Classroom;
