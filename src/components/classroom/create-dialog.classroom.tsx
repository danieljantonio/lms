import { ChalkboardTeacher } from '@phosphor-icons/react';
import { trpc } from '../../lib/trpc';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useState } from 'react';

export type CreateClassDto = {
	name: string;
	grade: number;
	code: string;
};

const CreateClass = () => {
	const [show, setShow] = useState(false);
	const router = useRouter();
	const utils = trpc.useContext();

	const { register, handleSubmit, setValue } = useForm<CreateClassDto>();

	const createClass = trpc.classroom.create.useMutation({
		onSuccess: (data) => {
			setShow(false);
			utils.classroom.getClassrooms.invalidate();
			router.push(`/app/classroom/${data.code}`);
		},
	});

	const onSubmit = handleSubmit((data) => {
		createClass.mutate(data);
	});

	return (
		<>
			<button
				className="btn btn-accent gap-2"
				onClick={() => setShow(true)}>
				<ChalkboardTeacher weight="fill" size={24} />
				Create Classroom
			</button>
			<input
				type="checkbox"
				readOnly
				checked={show}
				className="modal-toggle"
			/>
			<div className="modal !mt-0">
				<div className="modal-box relative">
					<label
						className="btn text-white btn-error btn-sm btn-circle absolute right-3 top-3"
						onClick={() => setShow(false)}>
						✕
					</label>
					<form className="flex flex-col gap-4" onSubmit={onSubmit}>
						<h3 className="text-lg font-bold">Create Classroom</h3>

						<div className="form-control w-full">
							<label className="label pl-0">
								<span className="label-text">Name</span>
							</label>
							<input
								{...register('name')}
								placeholder="ABC Basics"
								className="input input-bordered w-full"
								required
							/>
						</div>
						<div className="form-control w-full">
							<label className="label pl-0">
								<span className="label-text">
									Code (8 Character)
								</span>
							</label>
							<input
								{...register('code')}
								placeholder="ABCD1234"
								onChange={(e) =>
									setValue(
										'code',
										e.target.value.toUpperCase(),
									)
								}
								className="input input-bordered w-full"
								required
								maxLength={8}
								minLength={8}
							/>
						</div>
						<div className="form-control w-full">
							<label className="label pl-0">
								<span className="label-text">Grade (1-12)</span>
							</label>
							<input
								{...register('grade', {
									min: 1,
									max: 12,
									valueAsNumber: true,
								})}
								placeholder="1 - 12"
								type="number"
								className="input input-bordered w-full"
								required
								max={12}
								min={1}
							/>
						</div>
						<div className="card-actions justify-end">
							<button
								disabled={createClass.isLoading}
								type="submit"
								className="btn w-fit btn-primary ">
								Create
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};
export default CreateClass;
