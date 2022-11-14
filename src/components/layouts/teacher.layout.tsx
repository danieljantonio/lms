import React, { FC, PropsWithChildren } from 'react';
import { Card, Dropdown, Navbar, Sidebar } from 'flowbite-react';
import GlobalLayout from './global.layout';
import { ViewColumnsIcon, UserGroupIcon, PencilSquareIcon, AcademicCapIcon } from '@heroicons/react/24/solid';
import useAuth from '../../lib/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { useCustomRoute } from '../../lib/hooks/useCustomRoute';
import { useRouter } from 'next/router';

interface Props {
	active?: string;
}

const TeacherLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
	const { user, isLoading, isAuthenticated } = useAuth();
	const { basePath, getNewRoute } = useCustomRoute();
	const router = useRouter();

	if (isLoading) return <div>Loading...</div>;

	if (!isAuthenticated) router.push('/');

	return (
		<>
			<Navbar fluid={true} className="rounded-lg border">
				<Navbar.Brand href={basePath}>
					<span className="self-center whitespace-nowrap text-xl font-semibold">Ignosis</span>
				</Navbar.Brand>
				<Navbar.Collapse>
					<Navbar.Link href={basePath} active={true}>
						Home
					</Navbar.Link>
					<Dropdown label={`Hi, ${user?.name}`} inline={true} placement="bottom">
						<Dropdown.Item>Settings</Dropdown.Item>
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
							<Sidebar.Item href={getNewRoute('classes')} icon={UserGroupIcon} label="2">
								Classes
							</Sidebar.Item>
							<Sidebar.Item href={getNewRoute('tests')} icon={PencilSquareIcon} label="3">
								Tests
							</Sidebar.Item>
							<Sidebar.Item href={getNewRoute('students')} icon={AcademicCapIcon} label="40">
								Students
							</Sidebar.Item>
						</Sidebar.ItemGroup>
					</Sidebar.Items>
				</Sidebar>
				<main className="w-full">
					<Card className="shadow-sm">{children}</Card>
				</main>
			</div>
		</>
	);
};

export default TeacherLayout;
