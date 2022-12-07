import React, { FC, PropsWithChildren } from 'react';
import { Dropdown, Navbar } from 'flowbite-react';
import useAuth from '../../lib/hooks/useAuth';
import { signOut } from 'next-auth/react';

interface Props {
	active?: string;
}

const CommonLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
	const { isAuthenticated, user } = useAuth();

	return (
		<div className="mx-auto min-h-screen max-w-7xl">
			<Navbar fluid={true}>
				<Navbar.Brand href="/">
					<span className="self-center whitespace-nowrap text-xl font-semibold">Ignosis</span>
				</Navbar.Brand>
				<Navbar.Collapse>
					<Navbar.Link href="/">Home</Navbar.Link>
					<Navbar.Link href="/pricing">Pricing</Navbar.Link>
					<Navbar.Link href="/about">About</Navbar.Link>
					{isAuthenticated ? (
						<Dropdown label={`Hi, ${user?.name}`} inline={true} placement="bottom">
							<Dropdown.Item onClick={() => signOut({ redirect: true, callbackUrl: '/' })}>
								Sign out
							</Dropdown.Item>
						</Dropdown>
					) : (
						<Navbar.Link href="/auth">Sign In</Navbar.Link>
					)}
				</Navbar.Collapse>
			</Navbar>
			<main className="h-fullbar">{children}</main>
		</div>
	);
};

export default CommonLayout;
