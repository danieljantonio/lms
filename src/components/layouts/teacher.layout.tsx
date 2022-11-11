import React, { FC, PropsWithChildren } from 'react';
import { Dropdown, Navbar, Sidebar } from 'flowbite-react';
import GlobalLayout from './global.layout';
import { ViewColumnsIcon, UserGroupIcon, PencilSquareIcon, AcademicCapIcon } from '@heroicons/react/24/solid';
import useAuth from '../../hooks/useAuth';
import { signOut } from 'next-auth/react';

// TODO: Connect useAuth hook and show the user in navbar
const TeacherLayout: FC<PropsWithChildren> = ({ children }) => {
	const { user } = useAuth();

	return (
		<GlobalLayout>
			<Navbar fluid={true} rounded={true} className="border">
				<Navbar.Brand href="/">
					<span className="self-center whitespace-nowrap text-xl font-semibold">Ignosi</span>
				</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse>
					<Navbar.Link href="/navbars" active={true}>
						Home
					</Navbar.Link>
					<Dropdown label={`Hi, ${user?.name}`} inline={true}>
						<Dropdown.Item>Settings</Dropdown.Item>
						<Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
					</Dropdown>
					<Navbar.Link href="/navbars"></Navbar.Link>
				</Navbar.Collapse>
			</Navbar>
			<div className="mt-4 flex">
				<Sidebar className="min-w-sidebar rounded-md border">
					<Sidebar.Items>
						<Sidebar.ItemGroup>
							<Sidebar.Item href="#" icon={ViewColumnsIcon}>
								Dashboard
							</Sidebar.Item>
							<Sidebar.Item href="#" icon={UserGroupIcon} label="2">
								Manage Classes
							</Sidebar.Item>
							<Sidebar.Item href="#" icon={PencilSquareIcon} label="3">
								Manage Tests
							</Sidebar.Item>
							<Sidebar.Item href="#" icon={AcademicCapIcon} label="40">
								Manage Students
							</Sidebar.Item>
						</Sidebar.ItemGroup>
					</Sidebar.Items>
				</Sidebar>
				<main className="m-4">{children}</main>
			</div>
		</GlobalLayout>
	);
};

export default TeacherLayout;
