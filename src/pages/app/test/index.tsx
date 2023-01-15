import { Card } from 'flowbite-react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Tests: NextPage = () => {
	const router = useRouter();
	return (
		<div className="flex flex-col">
			{/* <p className="text-2xl">Create New Test</p> */}
			<Card
				className="w-48 items-center hover:cursor-pointer hover:bg-gray-100"
				onClick={() => router.push('/app/test/create')}>
				Create New Test
			</Card>
			{/* <Link href="/app/test/create">Create Test</Link> */}
		</div>
	);
};

export default Tests;
