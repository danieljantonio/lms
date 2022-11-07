import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../components/layouts/admin.layout';
import { trpc } from '../../utils/trpc';

const App: NextPage = () => {
	return (
		<AdminLayout>
			<div className="flex flex-col items-center justify-center gap-2">
				<div>
					<h1>Admin Home</h1>
					<p>
						This will be a temporary place to run commands and test routes such as create school, create x,
						add x, add y, as it should be all automated in the future.
					</p>
				</div>
				<AuthShowcase />
			</div>
		</AdminLayout>
	);
};

export default App;

const AuthShowcase: React.FC = () => {
	const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

	const { data: sessionData } = useSession();

	return (
		<div>
			<p className="text-2xl text-blue-500">User Info</p>
			{sessionData && (
				<div>
					<p className="text-xl">Logged in as {sessionData?.user?.name}</p>
				</div>
			)}
		</div>
	);
};
