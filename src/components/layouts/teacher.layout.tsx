import React, { FC, PropsWithChildren } from 'react';
import { Card, Dropdown, Navbar, Sidebar } from 'flowbite-react';
import GlobalLayout from './global.layout';
import { ViewColumnsIcon, UserGroupIcon, PencilSquareIcon, AcademicCapIcon } from '@heroicons/react/24/solid';
import useAuth from '../../lib/hooks/useAuth';
import { signOut } from 'next-auth/react';

interface Props {
	active?: string;
}

const TeacherLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
	const { user, isLoading } = useAuth();

	if (isLoading) return <div>Loading...</div>;

	return (
		<GlobalLayout>
			<Navbar fluid={true} rounded={true} className="border">
				<Navbar.Brand href="/">
					<span className="self-center whitespace-nowrap text-xl font-semibold">Ignosis</span>
				</Navbar.Brand>
				<Navbar.Collapse>
					<Navbar.Link href="/" active={true}>
						Home
					</Navbar.Link>
					<Dropdown label={`Hi, ${user?.name}`} inline={true}>
						<Dropdown.Item>Settings</Dropdown.Item>
						<Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
					</Dropdown>
				</Navbar.Collapse>
			</Navbar>
			<div className="mt-4 flex min-w-full gap-4">
				<Sidebar className="min-w-sidebar rounded-md border">
					<Sidebar.Items>
						<Sidebar.ItemGroup>
							<Sidebar.Item href="/teacher" icon={ViewColumnsIcon}>
								Dashboard
							</Sidebar.Item>
							<Sidebar.Item href="/teacher/classes" icon={UserGroupIcon} label="2">
								Manage Classes
							</Sidebar.Item>
							<Sidebar.Item href="/teacher/tests" icon={PencilSquareIcon} label="3">
								Manage Tests
							</Sidebar.Item>
							<Sidebar.Item href="/teacher/students" icon={AcademicCapIcon} label="40">
								Manage Students
							</Sidebar.Item>
						</Sidebar.ItemGroup>
					</Sidebar.Items>
				</Sidebar>
				<main className="w-full">
					<Card className="shadow-sm">{children}</Card>
				</main>
			</div>
		</GlobalLayout>
	);
};

export default TeacherLayout;
