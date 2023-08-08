import useAuth from '@/lib/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { FilePlus } from '@phosphor-icons/react';
import type { Test } from '@prisma/client';
import date from 'date-and-time';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

type ClassroomQueryProp = {
	code: string;
};

const Classroom: NextPage = () => {
	const router = useRouter();
	const { user } = useAuth();
	const { code } = router.query as ClassroomQueryProp;
	const [activeTab, setActiveTab] = useState<number>(2);

	const { data: classroom, isLoading: classroomIsLoading } =
		trpc.classroom.getClassroom.useQuery(
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
				<div className="tabs tabs-boxed">
					{/* <a
						className={`tab ${activeTab === 1 && 'tab-active'}`}
						onClick={() => setActiveTab(1)}>
						Announcements
					</a> */}
					<a
						className={`tab ${activeTab === 2 && 'tab-active'}`}
						onClick={() => setActiveTab(2)}>
						Tests
					</a>
					<a
						className={`tab ${activeTab === 3 && 'tab-active'}`}
						onClick={() => setActiveTab(3)}>
						Students
					</a>
				</div>
				{activeTab === 2 && (
					<TestTab
						userId={user?.id}
						classroom={classroom}
						redirect={(path: string) => router.push(path)}
					/>
				)}
			</div>
		</div>
	);
};

const TestTab = ({
	classroom,
	userId,
	redirect,
}: {
	classroom: any;
	userId: string | undefined;
	redirect: (path: string) => void;
}) => {
	return (
		<>
			{classroom.tests?.map((test: Test) => {
				return (
					<TestItem
						onClick={() => redirect(`/app/test/${test.id}`)}
						key={test.id}
						name={test.name}
						startDate={test.startDate}
						endDate={test.endDate}
					/>
				);
			})}
			{classroom.tests?.length === 0 ? (
				<div className="border h-24 w-full rounded-lg flex">
					<p className="m-auto">No Tests Available</p>
				</div>
			) : null}
			{classroom.teacherId === userId ? (
				<Link
					href={`/app/test/create?classroom=${classroom.id}&code=${classroom.code}`}
					className="btn btn-primary gap-2">
					<FilePlus size={24} weight="fill" /> Create Test
				</Link>
			) : null}
		</>
	);
};

type TestItemProps = {
	name: string;
	startDate: Date;
	endDate: Date;
	graded?: boolean;
	onClick: () => void;
};

const TestItem = ({
	name,
	startDate,
	endDate,
	graded = false,
	onClick,
}: TestItemProps) => {
	return (
		<div
			onClick={onClick}
			className="card border card-compact w-full bg-base-100 hover:cursor-pointer hover:bg-base-200">
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
