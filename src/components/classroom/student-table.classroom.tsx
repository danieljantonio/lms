import { User } from '@prisma/client';
import { Table } from 'flowbite-react';
import { FC } from 'react';
import useAuth from '../../lib/hooks/useAuth';

type Props = {
	students: User[];
};

const StudentTable: FC<Props> = ({ students }) => {
	const { role } = useAuth();
	return (
		<Table hoverable={true}>
			<Table.Head>
				<Table.HeadCell>Student Name</Table.HeadCell>
				<Table.HeadCell>Role</Table.HeadCell>
				{role === 'TEACHER' && (
					<Table.HeadCell>
						<span className="sr-only">Info</span>
					</Table.HeadCell>
				)}
			</Table.Head>
			<Table.Body className="divide-y">
				{students.map((student) => (
					<Table.Row key={student.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
						<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
							{student.name}
						</Table.Cell>
						<Table.Cell>STUDENT</Table.Cell>
						{role === 'TEACHER' && (
							<Table.Cell>
								<p className="cursor-pointer text-right font-medium text-blue-600 hover:underline dark:text-blue-500">
									Remove
								</p>
							</Table.Cell>
						)}
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
};

export default StudentTable;
