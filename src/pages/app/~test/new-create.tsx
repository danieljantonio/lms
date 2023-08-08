import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { trpc, type RouterTypes } from '@/lib/trpc';
import { QuestionProps } from '@/types/tests';
import { useForm } from 'react-hook-form';
import { Check, X } from '@phosphor-icons/react';

const CreateTest: NextPage = () => {
	// Hooks
	const router = useRouter();
	const { register, handleSubmit, getValues } =
		useForm<RouterTypes['test']['create']['input']>();

	const [questions, setQuestions] = useState<QuestionProps[]>([]);

	const { query } = router;
	const { classroom: classroomId, code: classroomCode } = query;

	if (!classroomId || !classroomCode)
		return (
			<div className="w-full h-24 flex justify-center items-center">
				Please proceed in creating the test through a classroom.
			</div>
		);

	const createTest = trpc.test.create.useMutation({
		onSuccess(data) {
			router.push(`/app/test/${data.id}`);
		},
	});

	const onSubmit = handleSubmit((data) => {
		data.classroomId = classroomId as string;
		console.log(data);
	});

	return (
		<div className="mx-auto max-w-screen-xl">
			<p className="text-xl">Create New Test</p>
			<div className="divider"></div>
			<form action="" className="form-control gap-2">
				<div>
					<div className="flex flex-wrap">
						<OptionsInput label="Test Name">
							<input
								className="input input-bordered w-full"
								placeholder="Ujian Akhir Semester"
								{...register('testName', {
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
					</div>
					<div className="flex flex-wrap">
						<OptionsInput label="Start Date">
							<input
								className="input input-bordered w-full"
								type="datetime-local"
								value={new Date().toISOString().slice(0, 16)}
								{...register('startDate', {
									required: true,
									valueAsDate: true,
								})}
							/>
						</OptionsInput>
						<OptionsInput label="End Date">
							<input
								value={new Date().toISOString().slice(0, 16)}
								type="datetime-local"
								className="input input-bordered w-full"
								{...register('endDate', {
									required: true,
									valueAsDate: true,
								})}
							/>
						</OptionsInput>
					</div>
					<div className="flex flex-wrap">
						<OptionsInput label="Duration">
							<input
								className="input input-bordered w-full"
								value={90}
								type="number"
								{...register('duration', {
									required: true,
									valueAsNumber: true,
								})}
							/>
						</OptionsInput>
					</div>
				</div>
				<div className="divider">Questions</div>
				<QuestionItem questionNo={1} />
				<QuestionItem questionNo={2} />
				<QuestionItem questionNo={3} />
				<QuestionItem questionNo={4} />
				<button
					type="button"
					className="btn btn-accent"
					onClick={() => console.log('add question')}>
					Add Question
				</button>
				<button type="submit" className="btn" onClick={onSubmit}>
					Log
				</button>
			</form>
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

type QuestionItemProps = {
	questionNo: number;
};

const QuestionItem = ({ questionNo }: QuestionItemProps) => {
	return (
		<>
			<div>
				<label className="label text-sm pl-0">
					Question {questionNo}
				</label>
				<input
					type="text"
					placeholder={`Question ${questionNo}`}
					className="input input-bordered w-full"
				/>
			</div>
			<ChoiceItem correct />
			<ChoiceItem />
			<ChoiceItem />
			<div className="divider"></div>
		</>
	);
};

type ChoiceItemProps = {
	correct?: boolean;
};

const ChoiceItem = ({ correct = false }: ChoiceItemProps) => {
	return (
		<div className="form-control">
			<div className="input-group">
				<input
					type="text"
					placeholder="Multiple Choice"
					className={`input input-bordered w-full ${
						correct ? 'outline-success' : ''
					}`}
				/>
				<button
					className={`btn btn-square btn-success  mr-[1px] ${
						correct ? '' : 'btn-outline'
					}`}
					type="button">
					<Check weight="bold" size={18} />
				</button>
				<button
					className="btn btn-square btn-error btn-outline"
					type="button">
					<X weight="bold" size={18} />
				</button>
			</div>
		</div>
	);
};

export default CreateTest;
