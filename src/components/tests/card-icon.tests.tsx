import { Classroom, Test } from '@prisma/client';
import { Card } from 'flowbite-react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import {
	formatDate,
	validateTestIsOngoing,
	validateTestIsOver,
	validateTestNotStarted,
} from '../../lib/helpers/date.helpers';

type Props = {
	test: Test & {
		classroom: Classroom;
	};
};

const CardIcon: FC<Props> = ({ test }) => {
	const router = useRouter();
	return (
		<Card
			className="mt-4 hover:cursor-pointer
	hover:bg-gray-200"
			onClick={() => {
				router.push(`/app/test/${test.id}`);
			}}>
			<div className="flex justify-between">
				<p className="my-auto">
					{test.name} - {test.classroom.name}
				</p>
				<div className="text-right">
					{validateTestIsOver(test.endDate) && <div>Test overdue</div>}
					{validateTestIsOngoing(test.startDate, test.endDate) && (
						<div>
							<p>
								Due: {formatDate(test.endDate)} ({test.duration} minutes)
							</p>
						</div>
					)}
					{validateTestNotStarted(test.startDate) && (
						<div>
							<p>
								Starts: {formatDate(test.startDate)} ({test.duration} minutes)
							</p>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};

export default CardIcon;
