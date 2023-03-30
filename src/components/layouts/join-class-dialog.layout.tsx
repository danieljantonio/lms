import { FolderSimplePlus } from '@phosphor-icons/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../lib/trpc';

const JoinClass = () => {
	const [show, setShow] = useState(false);
	const [classCode, setClassCode] = useState<string>('');
	const router = useRouter();

	const joinClass = trpc.classroom.join.useMutation({
		onSuccess: (data) => {
			console.log(data);
			router.push(`/app/classroom/${classCode}`);
		},
	});

	return (
		<>
			<button
				className="btn btn-accent gap-2"
				onClick={() => setShow(true)}>
				<FolderSimplePlus weight="fill" size={24} />
				Join Classroom
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
					<form
						className="flex flex-col gap-4"
						onSubmit={() => joinClass.mutate({ code: classCode })}>
						<h3 className="text-lg font-bold">Join Classroom</h3>
						<input
							type="text"
							className="w-full input input-bordered bg-base-200"
							value={classCode}
							onChange={(e) =>
								setClassCode(e.target.value.toUpperCase())
							}
							maxLength={8}
							minLength={8}
							placeholder="Enter School Code"
							required
						/>
						<div className="card-actions justify-end">
							<button
								type="submit"
								className="btn w-fit btn-primary ">
								Join
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};
export default JoinClass;
