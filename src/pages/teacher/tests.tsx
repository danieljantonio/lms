import { type NextPage } from 'next';
import GlobalLayout from '../../components/layouts/global.layout';

const TestsPanel: NextPage = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<div>
				<h1>This is the place to handle and manage all of the tests available.</h1>
			</div>
		</div>
	);
};

export default TestsPanel;
