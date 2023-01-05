import { Card } from 'flowbite-react';
import { NextPage } from 'next';
import Link from 'next/link';

const Tests: NextPage = () => {
	return (
		<div>
			<p className="text-2xl">Create New Test</p>
			<Link href="/app/test/create">Create Test</Link>
		</div>
	);
};

export default Tests;
