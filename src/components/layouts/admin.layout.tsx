import React, { FC, PropsWithChildren } from 'react';
import { Navbar, Sidebar } from 'flowbite-react';
import GlobalLayout from './global.layout';
import { ChartPieIcon, ViewColumnsIcon, InboxIcon, UserIcon } from '@heroicons/react/24/solid';

// TODO: Connect useAuth hook and show the user in navbar
const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
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
					<Navbar.Link href="/navbars">About</Navbar.Link>
					<Navbar.Link href="/navbars">Services</Navbar.Link>
					<Navbar.Link href="/navbars">Pricing</Navbar.Link>
					<Navbar.Link href="/navbars">Contact</Navbar.Link>
				</Navbar.Collapse>
			</Navbar>
			<div className="mt-4 flex">
				<Sidebar className="min-w-sidebar rounded-md border">
					<Sidebar.Items>
						<Sidebar.ItemGroup>
							<Sidebar.Item href="#" icon={ChartPieIcon}>
								Dashboard
							</Sidebar.Item>
							<Sidebar.Item href="#" icon={ViewColumnsIcon} label="Pro" labelColor="alternative">
								Kanban
							</Sidebar.Item>
							<Sidebar.Item href="#" icon={InboxIcon} label="3">
								Inbox
							</Sidebar.Item>
							<Sidebar.Item href="#" icon={UserIcon}>
								Users
							</Sidebar.Item>
						</Sidebar.ItemGroup>
					</Sidebar.Items>
				</Sidebar>
				<main className="m-4">{children}</main>
			</div>
		</GlobalLayout>
	);
};

export default AdminLayout;
