import { Tabs } from 'flowbite-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import StudentTable from '../../../components/classroom/common/student-table.classroom';
import ClassTests from '../../../components/classroom/test.classroom';
import { trpc } from '../../../lib/trpc';

type ClassroomQueryProp = {
	code: string;
};

const Classroom: NextPage = () => {
	const router = useRouter();
	const { code } = router.query as ClassroomQueryProp;

	const { data: classroom, isLoading } = trpc.classroom.getClassroomData.useQuery({ code: code.toUpperCase() });

	if (isLoading) return <div>Loading...</div>;
	if (!classroom) return <div>No classroom data</div>;

	return (
		<div>
			<div className="mb-2 text-2xl">{`${classroom?.name}`.toUpperCase()}</div>
			<div>
				<Tabs.Group aria-label="Full width tabs" style="underline">
					<Tabs.Item title="Home">
						<p>Home</p>
						<p>This will contain announcements</p>
					</Tabs.Item>
					<Tabs.Item title="Modules">
						<p>Modules</p>
						<p>This will contain the class modules / lessons</p>
					</Tabs.Item>
					<Tabs.Item title="Tests">
						<ClassTests />
					</Tabs.Item>
					<Tabs.Item title="Participants">
						<StudentTable users={classroom.users} />
					</Tabs.Item>
					<Tabs.Item title="Settings" disabled>
						<p className="text-xl mb-2">Teacher: {classroom.teacher.name}</p>
					</Tabs.Item>
				</Tabs.Group>
			</div>
		</div>
	);
};

export default Classroom;
