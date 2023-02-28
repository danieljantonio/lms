import { Classroom, Test } from '@prisma/client';
import { useRouter } from 'next/router';
import { FC } from 'react';
import date from 'date-and-time';

type Props = {
	test: Test & {
		classroom: Classroom;
	};
	overdue?: Boolean;
	grade?: string;
};

const TestCard: FC<Props> = ({ test, overdue = false, grade }) => {
	const router = useRouter();
	return (
		<div
			className={`mt-4 flex h-20 rounded-md border 
			hover:cursor-pointer hover:bg-gray-100`}
			onClick={() => {
				if (!overdue) router.push(`/app/test/${test.id}`);
			}}>
			<div className="mx-auto flex min-w-20 border-r-2 bg-gray-50 py-2">
				<div className="m-auto flex w-full flex-col items-center">
					<p className=" -mb-1 px-6 text-3xl font-semibold">{date.format(test.startDate, 'D')}</p>
					<p className="px-6 text-sm font-semibold uppercase text-gray-500">
						{date.format(test.startDate, 'MMM')}
					</p>
				</div>
			</div>
			<div className="my-auto flex w-full px-6">
				<div className="m-auto flex w-full flex-col">
					<p className="text-md font-semibold">{test.name}</p>
					<p className="text-sm text-gray-400">
						Due: <i>{date.format(test.endDate, 'D MMM')}</i>
					</p>
				</div>
				{grade && (
					<p className="float-right my-auto h-fit min-w-fit">
						Grade: <i className="font-semibold text-gray-700">{parseFloat(grade).toFixed(0)}</i>
					</p>
				)}
			</div>
		</div>
	);
};

export default TestCard;
