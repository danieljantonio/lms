import { FloppyDisk, Plus, XCircle } from '@phosphor-icons/react';
import type { Question } from '@prisma/client';
import { useEffect, useState, type FC } from 'react';
import ChoiceInput from './choice-input.tests';

export interface QuestionInputProps {
	question: Question;
}

const QuestionInput: FC<QuestionInputProps> = ({ question }) => {
	const [isEssay, setIsEssay] = useState(
		question.correctChoice ? false : true,
	);
	const [choices, setChoices] = useState<string[]>(question.choices);
	const [correctChoice, setCorrectChoice] = useState<string | undefined>(
		question?.correctChoice || undefined,
	);
	const [isChanged, setIsChanged] = useState(false);

	useEffect(() => {
		console.log('re-render');
	}, [correctChoice]);

	const saveChanges = () => {
		setIsChanged(false);
	};

	return (
		<div className="card border mt-4">
			<div className="relative card-body">
				<div className="join">
					<button className="btn join-item">
						Question {question.questionNo}
					</button>
					<input
						defaultValue={question.question}
						type="text"
						placeholder={`Question ${question.questionNo}`}
						className="input input-bordered w-full join-item"
					/>
				</div>
				<XCircle
					size={24}
					weight="fill"
					// onClick={removeQuestion}
					className="absolute right-2 top-2 mx-auto w-5 text-gray-500 hover:cursor-pointer hover:text-gray-800"
				/>
				{!isEssay &&
					choices.map((questionChoice, index) => (
						<ChoiceInput
							onRemove={() => {
								setChoices((_choices: string[]) => {
									const _choice = [..._choices];
									return _choice.filter(
										(choice) => choice !== questionChoice,
									);
								});
								setIsChanged(true);
							}}
							key={questionChoice + index}
							choice={questionChoice}
							isCorrect={questionChoice === correctChoice}
							onChange={(data, isCorrect) => {
								if (isCorrect) {
									setCorrectChoice(data);
								}
								setChoices((_choices: string[]) => {
									const _choice = [..._choices];
									_choice[index] = data;
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
								onChange={() => setIsEssay(!isEssay)}
								checked={isEssay}
							/>
						</label>
					</div>
					<div className="justify-end card-actions">
						{!isEssay && (
							<button
								className="btn btn-info text-white"
								onClick={() => {
									setChoices([...choices, '']);
									setIsChanged(true);
								}}
								disabled={choices.length >= 5}>
								<Plus size={16} /> Add Choice
							</button>
						)}
						{isChanged && (
							<button
								className="btn btn-primary text-white"
								onClick={saveChanges}>
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
