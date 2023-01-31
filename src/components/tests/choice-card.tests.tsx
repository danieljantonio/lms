import { Card } from 'flowbite-react';
import { FC, PropsWithChildren } from 'react';

type Props = {
	selected?: boolean;
	value: string;
	onClick: (value: string) => void;
};

const ChoiceCard: FC<PropsWithChildren<Props>> = ({ children, selected = false, value, onClick }) => {
	return (
		<Card
			onClick={() => onClick(value)}
			className={`${
				selected && '!bg-green-200'
			} mx-auto mt-4 max-w-screen-md hover:cursor-pointer hover:bg-gray-100`}>
			<p>{children}</p>
		</Card>
	);
};

export default ChoiceCard;
