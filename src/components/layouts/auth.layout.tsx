import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import useAuth from '../../lib/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { useCustomRoute } from '../../lib/hooks/useCustomRoute';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Chalkboard, HouseSimple, Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import JoinClass from './join-class-dialog.layout';
import { trpc } from '../../lib/trpc';

interface Props {
	active?: string;
}

const AuthLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
	const { user, isLoading, isAuthenticated, role } = useAuth();
	const { theme, setTheme } = useTheme();
	const [showContent, setShowContent] = useState(false);

	const { basePath } = useCustomRoute();
	const router = useRouter();

	useEffect(() => {
		// if its still loading, wait
		if (isLoading) return;
		// if the user is not authenticated, redirect to /
		if (!isAuthenticated) {
			setShowContent(false);
			router.push('/');
		}
		// if the user does not have a school, redirect to /join
		else if (!user?.schoolId) {
			setShowContent(false);
			router.push('/join');
		} else {
			setShowContent(true);
		}
		return;
	}, [isLoading, isAuthenticated, user]);

	// if the user has a school, continue rendering

	if (basePath === '/') return <div>{children}</div>;

	if (!showContent || isLoading) return <div>Loading...</div>;

	return (
		<div className="mx-3 mt-4">
			<div className="navbar bg-base-100 rounded-lg border">
				<div className="flex-1">
					<a className="btn btn-ghost normal-case text-xl">Ignosi</a>
				</div>
				<div className="flex-none gap-4">
					<div
						className="btn btn-sm btn-outline btn-square"
						onClick={() => {
							console.log('The current theme is', theme);

							setTheme(theme == 'light' ? 'dark' : 'light');
						}}>
						{theme && theme === 'light' ? (
							<Sun size={24} />
						) : (
							<Moon size={24} />
						)}
					</div>
					<div className="dropdown dropdown-end">
						<label
							tabIndex={0}
							className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								<img src="https://i.pravatar.cc/300" />
							</div>
						</label>
						<ul
							tabIndex={0}
							className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
							<li>
								<a
									className="justify-between"
									onClick={() => router.push('/profile')}>
									Profile
									{/* <span className="badge">New</span> */}
								</a>
							</li>
							<li>
								<label onClick={() => router.push('/settings')}>
									Settings
								</label>
							</li>
							<li>
								<span onClick={() => signOut()}>Logout</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="mt-4 flex min-w-full gap-4">
				<div className="flex flex-col border rounded-lg min-w-[250px] p-4 space-y-2">
					<SidebarItem
						href={'/app'}
						text="Dashboard"
						icon={<HouseSimple size={24} weight="fill" />}
					/>
					{role === 'TEACHER' ? (
						<SidebarItem
							href={'/app'}
							text="Manage Students"
							icon={<Chalkboard size={24} weight="fill" />}
						/>
					) : null}
					<ClassItems />
					<JoinClass />
				</div>
				<main className="w-full px-3 py-4">{children}</main>
			</div>
		</div>
	);
};

const ClassItems = () => {
	// only fetch after all data has been received
	const { data, isLoading } = trpc.classroom.getClassrooms.useQuery(
		undefined,
		{
			refetchOnWindowFocus: false,
		},
	);

	if (isLoading)
		return <button className="btn btn-secondary loading"></button>;
	if (!data) return <button className="btn btn-disabled">No Classes</button>;

	return (
		<>
			{data.map(({ classroom }) => (
				<SidebarItem
					key={classroom.code}
					href={`/app/classroom/${classroom.code}`}
					text={classroom.code}
					type="secondary"
					icon={<Chalkboard size={24} weight="fill" />}
				/>
			))}
		</>
	);
};

type SidebarItemProps = {
	href: string;
	text: string;
	icon: ReactNode;
	type?: 'primary' | 'secondary';
};

const SidebarItem: FC<SidebarItemProps> = ({
	icon,
	href,
	text,
	type = 'primary',
}) => {
	return (
		<Link href={href} className={`btn btn-${type} gap-2 no-animation`}>
			{icon}
			{text}
		</Link>
	);
};

export default AuthLayout;
