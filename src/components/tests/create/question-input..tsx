import { trpc } from '@/lib/trpc';
import { FloppyDisk, Plus, XCircle } from '@phosphor-icons/react';
import type { Question } from '@prisma/client';
import { useState, type FC } from 'react';
import ChoiceInput from './choice-input.tests';

export interface QuestionInputProps {
	question: Question & {
		choices: {
			id?: string;
			choice: string;
			isCorrect: boolean;
		}[];
	};
	index: number;
	onRemove: (id: string) => void;
}

const QuestionInput: FC<QuestionInputProps> = ({
	index,
	question: data,
	onRemove,
}) => {
	const [isEssay, setIsEssay] = useState(data.isEssay);
	const [isChanged, setIsChanged] = useState(false);
	const [question, setQuestion] = useState(data.question);
	const [choices, setChoices] = useState(data.choices);
	const utils = trpc.useContext();

	const updateQuestion = trpc.question.updateQuestion.useMutation({
		onSuccess: () => {
			utils.question.getQuestions.invalidate();
		},
	});

	const onSave = () => {
		console.log({ ...data, choices });
		// setIsChanged(false);
		updateQuestion.mutate({
			questionId: data.id,
			question: {
				question,
				choices,
				isEssay,
			},
		});
	};

	return (
		<div className="card border mt-4 mx-auto max-w-screen-md">
			<div className="relative card-body">
				<div className="join">
					<button className="btn join-item">
						Question {index + 1}
					</button>
					<input
						defaultValue={question}
						type="text"
						placeholder={`Question ${index + 1}`}
						className="input input-bordered w-full join-item"
					/>
				</div>
				<XCircle
					size={24}
					weight="fill"
					onClick={() => onRemove(data.id)}
					className="absolute right-2 top-2 mx-auto w-5 text-gray-500 hover:cursor-pointer hover:text-gray-800"
				/>
				{!isEssay &&
					choices?.map(({ id, choice, isCorrect }, index) => (
						<ChoiceInput
							onRemove={() => {
								setChoices((_choices) => {
									const _choice = [..._choices];
									return _choice.filter(
										(_, i) => index !== i,
									);
								});
								setIsChanged(true);
							}}
							key={id || Math.random()}
							choice={choice}
							isCorrect={isCorrect}
							onChange={(data, _isCorrect) => {
								setChoices((_choices) => {
									const _choice = _choices.map((c, i) => ({
										...c,
										choice:
											data && index === i
												? data
												: c.choice, // on updated index, replace
										isCorrect:
											_isCorrect && index === i
												? true
												: false,
									}));
									return _choice;
								});
								setIsChanged(true);
							}}
						/>
					))}
				<div className="card-actions w-full justify-between">
					<div className="form-control w-44 justify-start">
						<label className="cursor-pointer label">
							<span className="label-text">Essay Question</span>
							<input
								type="checkbox"
								className="toggle toggle-accent"
								onChange={() => {
									setIsEssay(!isEssay);
									setIsChanged(true);
								}}
								checked={isEssay}
							/>
						</label>
					</div>
					<div className="justify-end card-actions">
						{!isEssay && (
							<button
								className="btn btn-info text-white"
								onClick={() => {
									setChoices([
										...choices,
										{
											isCorrect: false,
											choice: '',
										},
									]);
									setIsChanged(true);
								}}
								disabled={choices.length >= 5}>
								<Plus size={16} /> Add Choice
							</button>
						)}
						{isChanged && (
							<button
								className="btn btn-primary text-white"
								onClick={onSave}>
								<FloppyDisk size={16} /> Save
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuestionInput;
