import type { Classroom, Test } from '@prisma/client';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

interface ITestForm {
	test?: Test & { classroom: Classroom };
	disabled?: boolean;
	onSubmit: (data: any) => void;
}

const TestForm = ({ test, disabled, onSubmit }: ITestForm) => {
	const router = useRouter();

	const { query } = router;
	const { code: classroomCode } = query;
	const { register, handleSubmit } = useForm();

	return (
		<div
			className="mx-auto max-w-screen-xl"
			onSubmit={handleSubmit(onSubmit)}>
			<div className="card border">
				<div className="card-body">
					<p className="card-title">Create New Test</p>
					<form>
						<div className="flex flex-wrap">
							<OptionsInput label="Test Name">
								<input
									disabled={disabled}
									className="input input-bordered w-full"
									placeholder="Ujian Akhir Semester"
									{...register('name', {
										required: true,
										value: test?.name,
									})}
								/>
							</OptionsInput>
							<OptionsInput label="Classroom">
								<input
									className="input input-bordered w-full"
									disabled
									value={
										test?.classroom.code || classroomCode
									}
									readOnly
								/>
							</OptionsInput>
							<OptionsInput label="Start Date">
								<input
									disabled={disabled}
									className="input input-bordered w-full"
									value={test?.startDate
										.toISOString()
										.slice(0, 16)}
									type="datetime-local"
									{...register('startDate', {
										required: true,
									})}
								/>
							</OptionsInput>
							<OptionsInput label="End Date">
								<input
									disabled={disabled}
									type="datetime-local"
									className="input input-bordered w-full"
									value={test?.endDate
										.toISOString()
										.slice(0, 16)}
									{...register('endDate', {
										required: true,
									})}
								/>
							</OptionsInput>
							<OptionsInput label="Duration">
								<input
									disabled={disabled}
									className="input input-bordered w-full"
									type="number"
									value={test?.duration}
									{...register('duration', {
										valueAsNumber: true,
										required: true,
									})}
								/>
							</OptionsInput>
							<OptionsInput label="Passcode">
								<input
									value={test?.passcode}
									disabled={disabled}
									className="input input-bordered w-full"
									{...register('passcode', {
										required: true,
									})}
								/>
							</OptionsInput>
						</div>
						{disabled ?? (
							<button
								type="submit"
								className="btn btn-primary mx-2 mt-6 w-full">
								{test ? 'Save' : 'Create'}
							</button>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

type OptionsInputProps = {
	label: string;
	children: ReactNode;
};

const OptionsInput = ({ label, children }: OptionsInputProps) => {
	return (
		<div className="form-control w-full md:w-1/2">
			<div className="px-2">
				<label
					htmlFor={label.toLowerCase().replace(' ', '-')}
					className="label !pl-0">
					<span className="label-text">{label}</span>
				</label>
				{children}
			</div>
		</div>
	);
};

export default TestForm;
