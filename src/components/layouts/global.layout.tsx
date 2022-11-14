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

const GlobalLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
	const { user, isLoading, isAuthenticated, role } = useAuth();

	const { basePath, getNewRoute } = useCustomRoute();
	const router = useRouter();

	if (isLoading) return <div>Loading...</div>;

	if (!isAuthenticated) router.push('/');

	if (basePath === '/') return <div>{children}</div>;

	return (
		<div className="mx-3 mt-4">
			<Navbar fluid={true} className="rounded-lg border">
				<Navbar.Brand href="/">
					<span className="self-center whitespace-nowrap text-xl font-semibold">Ignosis</span>
				</Navbar.Brand>
				<Navbar.Collapse>
					<Navbar.Link href={basePath} active={true}>
						Home
					</Navbar.Link>
					<Dropdown label={`Hi, ${user?.name}`} inline={true} placement="bottom">
						<Dropdown.Item onClick={() => router.push('/settings')}>Settings</Dropdown.Item>
						<Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
					</Dropdown>
				</Navbar.Collapse>
			</Navbar>
			<div className="mt-4 flex min-w-full gap-4">
				<Sidebar className="min-w-sidebar overflow-hidden rounded-lg border">
					<Sidebar.Items>
						<Sidebar.ItemGroup>
							<Sidebar.Item href={basePath} icon={ViewColumnsIcon}>
								Dashboard
							</Sidebar.Item>
							{role === 'ADMIN' || role === 'PRINCIPAL' ? (
								<Sidebar.Item href={getNewRoute('schools')} icon={BuildingLibraryIcon}>
									School
								</Sidebar.Item>
							) : null}
							<Sidebar.Item href={getNewRoute('classes')} icon={UserGroupIcon} label="2">
								Classes
							</Sidebar.Item>
							<Sidebar.Item href={getNewRoute('tests')} icon={PencilSquareIcon} label="3">
								Tests
							</Sidebar.Item>
							{role !== 'STUDENT' ? (
								<Sidebar.Item href={getNewRoute('students')} icon={UsersIcon} label="40">
									Students
								</Sidebar.Item>
							) : null}
						</Sidebar.ItemGroup>
					</Sidebar.Items>
				</Sidebar>
				<main className="w-full">
					<Card className="shadow-sm">{children}</Card>
				</main>
			</div>
		</div>
	);
};

export default GlobalLayout;
