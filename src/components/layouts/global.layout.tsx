import React, { FC, PropsWithChildren } from 'react';

const GlobalLayout: FC<PropsWithChildren> = ({ children }) => {
	return <div className="mx-3 mt-4">{children}</div>;
};

export default GlobalLayout;
