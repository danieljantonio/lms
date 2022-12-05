import React, { FC, PropsWithChildren } from 'react';
import { Navbar } from 'flowbite-react';

interface Props {
	active?: string;
}

const CommonLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
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
				</Navbar.Collapse>
			</Navbar>
			<main className="h-fullbar">{children}</main>
		</div>
	);
};

export default CommonLayout;
