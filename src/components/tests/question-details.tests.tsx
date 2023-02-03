import { FC, useState } from 'react';
import { trpc } from '../../lib/trpc';
import ChoiceCard from './choice-card.tests';

type QuestionDetailsProps = {
	questionId: string;
	studentTestId: string;
	selectedAnswer: (e: string) => void;
};

const QuestionDetails: FC<QuestionDetailsProps> = ({ questionId, selectedAnswer, studentTestId }) => {
	const { data, isLoading: loadingQuestion } = trpc.question.getById.useQuery({
		questionId,
		studentTestId,
	});

	const [selectedId, setSelected] = useState<string>();

	const onSelectChoice = (e: string) => {
		selectedAnswer(e);
		setSelected(e);
	};

	if (!data) return <div>No questions</div>;

	const { question, chosenAnswerId } = data;

	const isSelected = (id: string) => {
		if (chosenAnswerId && !selectedId) {
			return id === chosenAnswerId;
		} else {
			return id === selectedId;
		}
	};

	return loadingQuestion ? (
		<div>Loading...</div>
	) : (
		<div>
			<p className="pb-2 text-2xl">
				Question {data.questionNo}: {question.question}
			</p>
			{question.choices.map((choice, index) => (
				<ChoiceCard key={index} value={choice.id} selected={isSelected(choice.id)} onClick={onSelectChoice}>
					{choice.answer}
				</ChoiceCard>
			))}
		</div>
	);
};

export default QuestionDetails;
