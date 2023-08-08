import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

interface ITestForm {
	onSubmit: (data: any) => void;
}

const TestForm = ({ onSubmit }: ITestForm) => {
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
									className="input input-bordered w-full"
									placeholder="Ujian Akhir Semester"
									{...register('name', {
										required: true,
									})}
								/>
							</OptionsInput>
							<OptionsInput label="Classroom">
								<input
									className="input input-bordered w-full"
									disabled
									value={classroomCode}
									readOnly
								/>
							</OptionsInput>
							<OptionsInput label="Start Date">
								<input
									className="input input-bordered w-full"
									type="datetime-local"
									{...register('startDate', {
										required: true,
									})}
								/>
							</OptionsInput>
							<OptionsInput label="End Date">
								<input
									type="datetime-local"
									className="input input-bordered w-full"
									{...register('endDate', {
										required: true,
									})}
								/>
							</OptionsInput>
							<OptionsInput label="Duration">
								<input
									className="input input-bordered w-full"
									type="number"
									{...register('duration', {
										valueAsNumber: true,
										required: true,
									})}
								/>
							</OptionsInput>
							<OptionsInput label="Passcode">
								<input
									className="input input-bordered w-full"
									{...register('passcode', {
										required: true,
									})}
								/>
							</OptionsInput>
						</div>
						<button
							type="submit"
							className="btn btn-primary mx-2 mt-6 w-full">
							Create
						</button>
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
