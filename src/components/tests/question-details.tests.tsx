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

	const { question } = data;

	return loadingQuestion ? (
		<div>Loading...</div>
	) : (
		<div>
			<p className="pb-2 text-2xl">
				Question {data.questionNo}: {question.question}
			</p>
			{question.choices.map((choice, index) => (
				<ChoiceCard key={index} value={choice.id} selected={choice.id === selectedId} onClick={onSelectChoice}>
					{choice.answer}
				</ChoiceCard>
			))}
		</div>
	);
};

export default QuestionDetails;
