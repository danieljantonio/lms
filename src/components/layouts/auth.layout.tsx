import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';
import { ViewColumnsIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import useAuth from '../../lib/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { useCustomRoute } from '../../lib/hooks/useCustomRoute';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Moon, Plus, Sun } from '@phosphor-icons/react';
import { useTheme } from 'next-themes';

interface Props {
	active?: string;
}

const AuthLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
	const { user, isLoading, isAuthenticated, role } = useAuth();
	const { theme, setTheme } = useTheme();

	const { basePath, getNewRoute } = useCustomRoute();
	const router = useRouter();
	// const { data, isLoading: classroomIsLoading } = trpc.classroom.getClassrooms.useQuery(undefined, {
	// 	refetchOnWindowFocus: false,
	// });

	useEffect(() => {
		console.log('The current theme is', theme);
	}, [theme]);

	if (isLoading) return <div>Loading...</div>;

	if (basePath === '/') return <div>{children}</div>;

	if (!isAuthenticated && ['/admin', '/teacher', '/app'].includes(basePath))
		router.push('/');

	if (!user?.schoolId) router.push('/join');

	return (
		<div className="mx-3 mt-4">
			<div className="navbar bg-base-300 rounded-lg">
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
				<div className="flex flex-col bg-base-300 rounded-lg min-w-[250px] p-4 space-y-2">
					<SidebarItem
						href={'/app'}
						text="Dashboard"
						icon={<ViewColumnsIcon width={24} height={24} />}
					/>
					{role === 'TEACHER' ? (
						<SidebarItem
							href={'/classroom'}
							text="Classroom"
							icon={<UserGroupIcon width={24} height={24} />}
						/>
					) : null}
					<SidebarItem
						href={'/classroom'}
						text="Your Classes"
						icon={<UserGroupIcon width={24} height={24} />}
					/>
					<button className="btn btn-accent gap-2">
						<Plus weight="fill" height={24} width={24} />
						Join Classroom
					</button>
				</div>
				<main className="w-full px-3 py-4">{children}</main>
			</div>
		</div>
	);
};

type SidebarItemProps = {
	href: string;
	text: string;
	icon: ReactNode;
	active?: boolean;
};

const SidebarItem: FC<SidebarItemProps> = ({
	icon,
	active = false,
	href,
	text,
}) => {
	return (
		<Link
			href={href}
			className={`btn btn-primary ${active ? '' : 'btn-outline'} gap-2`}>
			{icon}
			{text}
		</Link>
	);
};

export default AuthLayout;
