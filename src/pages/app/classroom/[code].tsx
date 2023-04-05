import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../../lib/trpc';
import date from 'date-and-time';
import { FilePlus } from '@phosphor-icons/react';
import Link from 'next/link';

type ClassroomQueryProp = {
	code: string;
};

const Classroom: NextPage = () => {
	const router = useRouter();
	const { code } = router.query as ClassroomQueryProp;

	const { data: classroom, isLoading: classroomIsLoading } =
		trpc.classroom.getClassroomData.useQuery(
			{ code: code.toUpperCase() },
			{ refetchOnWindowFocus: false },
		);

	if (classroomIsLoading) return <div>Loading...</div>;
	if (!classroom) return <div>No classroom data</div>;

	return (
		<div>
			<p className="mb-2 text-3xl">
				{`${classroom?.name}`.toUpperCase()} - Grade {classroom.grade}
			</p>
			<div className="divider">Tests</div>
			<div className="space-y-2">
				{classroom.test?.map((test) => {
					return (
						<TestItem
							key={test.id}
							name={test.name}
							startDate={test.startDate}
							endDate={test.endDate}
							graded
						/>
					);
				})}
				<TestItem
					name="Ujian Akhir Semester"
					startDate={new Date()}
					endDate={new Date()}
					graded
				/>
				<TestItem
					name="Latihan Ujian Akhir Semester"
					startDate={new Date()}
					endDate={new Date()}
				/>
				<Link
					href={`/app/test/create?classroom=${classroom.id}&code=${classroom.code}`}
					className="btn btn-primary gap-2">
					<FilePlus size={24} weight="fill" /> Create Test
				</Link>
			</div>
		</div>
	);
};

type TestItemProps = {
	name: string;
	startDate: Date;
	endDate: Date;
	graded?: boolean;
};

const TestItem = ({
	name,
	startDate,
	endDate,
	graded = false,
}: TestItemProps) => {
	return (
		<div className="card border card-compact w-full bg-base-100 hover:cursor-pointer hover:bg-base-200">
			<div className="card-body flex flex-row items-center justify-between w-full">
				<div className="flex gap-2">
					<p>{name}</p>
					{graded ? (
						<div className="badge badge-primary">Dinilai</div>
					) : null}
					{date.isSameDay(startDate, new Date()) ? (
						<div className="badge badge-secondary">Hari Ini</div>
					) : null}
				</div>
				<div className="flex w-fit flex-col">
					<p>Tanggal Ujian: {date.format(startDate, 'D MMM')}</p>
					<p>
						Pukul: {date.format(startDate, 'HH:mm')} -{' '}
						{date.format(endDate, 'HH:mm')}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Classroom;
