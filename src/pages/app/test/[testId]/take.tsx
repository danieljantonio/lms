import { NextPage } from 'next';

type ClassroomQueryProp = {
	testId: string;
};

const TakeTest: NextPage = () => {
	return (
		<div className="flex w-full flex-col text-center">
			<p className="mx-auto text-3xl font-semibold">Take Test</p>
		</div>
	);
};

export default TakeTest;
