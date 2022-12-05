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

const CommonLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
	const { user, isLoading, isAuthenticated, role } = useAuth();

	const { basePath, getNewRoute } = useCustomRoute();
	const router = useRouter();

	// if (isLoading) return <div>Loading...</div>;

	// if (basePath === '/') return <div>{children}</div>;

	// if (!isAuthenticated && ['/admin', '/teacher', '/app'].includes(basePath)) router.push('/');

	return (
		<div className="mx-auto min-h-screen max-w-7xl">
			<Navbar fluid={true}>
				<Navbar.Brand href="/">
					<span className="self-center whitespace-nowrap text-xl font-semibold">Ignosis</span>
				</Navbar.Brand>
				<Navbar.Collapse>
					<Navbar.Link href={basePath}>Home</Navbar.Link>
					<Navbar.Link href={basePath}>Pricing</Navbar.Link>
					<Navbar.Link href={basePath}>About</Navbar.Link>
				</Navbar.Collapse>
			</Navbar>
			<main className="h-fullbar">{children}</main>
		</div>
	);
};

export default CommonLayout;
