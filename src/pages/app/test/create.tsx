import { Card, Label, TextInput } from 'flowbite-react';
import { NextPage } from 'next';
import Link from 'next/link';

const CreateTest: NextPage = () => {
	return (
		<div className="mx-auto max-w-screen-xl">
			<p className="text-2xl">Create New Test</p>
			<Card>
				<div className="flex w-full flex-col justify-between gap-6 lg:flex-row">
					<div className="lg:w-2/3">
						<Label>Test Name</Label>
						<TextInput placeholder="Test Name" />
					</div>
					<div className="gap-6 lg:w-1/3">
						<div>
							<Label>Start Date</Label>
							<TextInput placeholder="Test Name" type="datetime-local" />
						</div>
						<div className="mt-4">
							<Label>End Date</Label>
							<TextInput placeholder="Test Name" type="datetime-local" />
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default CreateTest;
