import { type NextPage } from 'next';
import GlobalLayout from '../../components/layouts/global.layout';
import { trpc } from '../../lib/trpc';

const ClassesPanel: NextPage = () => {
	const { data, isLoading } = trpc.class.numberOfClasses.useQuery();

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<div>
				<h1>This page will list all the classes</h1>
				<p>You have {data} classes</p>
			</div>
		</div>
	);
};

export default ClassesPanel;
