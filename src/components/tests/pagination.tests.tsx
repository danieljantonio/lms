import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from '@heroicons/react/24/solid';
import { FC, useState } from 'react';

type Props = {
	currentPage: number;
	onPageChange: (e: number) => void;
	totalPages: number;
};

const CustomPagination: FC<Props> = ({ currentPage: _currentPage, totalPages, onPageChange }) => {
	const [currentPage, setCurrentPage] = useState<number>(_currentPage);

	const setPage = (newValue: number) => {
		if (newValue < 1 || newValue > totalPages) return;
		setCurrentPage(newValue);
		onPageChange(newValue);
	};

	return (
		<div className="flex gap-1">
			<div
				className="flex h-10 w-10 items-center justify-center rounded-md border hover:cursor-pointer "
				onClick={() => setPage(1)}>
				<ChevronDoubleLeftIcon width={24} />
			</div>
			<div
				className="flex h-10 w-10 items-center justify-center rounded-md border hover:cursor-pointer "
				onClick={() => setPage(currentPage - 1)}>
				<ChevronLeftIcon width={24} />
			</div>
			<div className="flex h-10 w-12 items-center justify-center rounded-md border bg-green-200">
				<p className="w-full">{currentPage}</p>
			</div>
			<div
				className="flex h-10 w-10 items-center justify-center rounded-md border hover:cursor-pointer "
				onClick={() => setPage(currentPage + 1)}>
				<ChevronRightIcon width={24} />
			</div>
			<div
				className="flex h-10 w-10 items-center justify-center rounded-md border hover:cursor-pointer "
				onClick={() => setPage(totalPages)}>
				<ChevronDoubleRightIcon width={24} />
			</div>
		</div>
	);
};

export default CustomPagination;
