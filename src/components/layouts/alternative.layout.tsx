import React, { FC, PropsWithChildren } from 'react';
import { Card, Dropdown, Navbar, Sidebar } from 'flowbite-react';
import {
	ViewColumnsIcon,
	UserGroupIcon,
	PencilSquareIcon,
	BuildingLibraryIcon,
	UsersIcon,
} from '@heroicons/react/24/solid';
import useAuth from '../../lib/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { useCustomRoute } from '../../lib/hooks/useCustomRoute';
import { useRouter } from 'next/router';

interface Props {
	active?: string;
}

const AuthLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
	const { user, isLoading, isAuthenticated, role } = useAuth();

	const { basePath, getNewRoute } = useCustomRoute();
	const router = useRouter();

	if (isLoading) return <div>Loading...</div>;

	if (basePath === '/') return <div>{children}</div>;

	if (!isAuthenticated && ['/admin', '/teacher', '/app'].includes(basePath)) router.push('/');

	return (
		<div className="min-h-screen">
			{/* <Navbar fluid={true} className="h-14 border-b-2">
				<Navbar.Brand href="/">
					<span className="self-center whitespace-nowrap text-xl font-semibold">Ignosis</span>
				</Navbar.Brand>
				<Navbar.Collapse>
					<Navbar.Link href={basePath} active={true}>
						Home
					</Navbar.Link>
					<Dropdown label={`Hi, ${user?.name}`} inline={true} placement="bottom">
						<Dropdown.Item onClick={() => router.push('/settings')}>Settings</Dropdown.Item>
						<Dropdown.Item onClick={() => signOut({ redirect: true, callbackUrl: '/' })}>
							Sign out
						</Dropdown.Item>
					</Dropdown>
				</Navbar.Collapse>
			</Navbar> */}
			<div className="flex w-fit gap-4">
				<Sidebar className="h-screen w-72">
					<Sidebar.Logo
						href="/"
						img="https://i.pinimg.com/originals/15/e0/c7/15e0c7e0317886fb215e2b7bd7b33eee.png"
						className="mx-auto">
						Ignosi
					</Sidebar.Logo>
					<Sidebar.Items>
						<Sidebar.ItemGroup>
							<Sidebar.Item href={basePath} icon={ViewColumnsIcon}>
								Dashboard
							</Sidebar.Item>
							{role === 'ADMIN' || role === 'PRINCIPAL' ? (
								<Sidebar.Item href={getNewRoute('school')} icon={BuildingLibraryIcon}>
									Manage School
								</Sidebar.Item>
							) : null}
							<Sidebar.Item href={getNewRoute('classes')} icon={UserGroupIcon} label="2">
								{role === 'STUDENT' ? 'Your' : 'Manage'} Classes
							</Sidebar.Item>
							<Sidebar.Item href={getNewRoute('tests')} icon={PencilSquareIcon} label="3">
								{role === 'STUDENT' ? 'Your' : 'Manage'} Tests
							</Sidebar.Item>
							{role !== 'STUDENT' ? (
								<Sidebar.Item href={getNewRoute('students')} icon={UsersIcon} label="40">
									Manage Students
								</Sidebar.Item>
							) : null}
						</Sidebar.ItemGroup>
					</Sidebar.Items>
				</Sidebar>
			</div>
			{/* <main className="w-full px-3 py-4">
				<Card className="shadow-none">{children}</Card>
			</main> */}
		</div>
	);
};

export default AuthLayout;
