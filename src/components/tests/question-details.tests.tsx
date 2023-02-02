import { FC, useState } from 'react';
import { trpc } from '../../lib/trpc';
import ChoiceCard from './choice-card.tests';

type QuestionDetailsProps = {
	id: string;
	selectedAnswer: (e: string) => void;
};

const QuestionDetails: FC<QuestionDetailsProps> = ({ id }) => {
	const { data: question, isLoading: loadingQuestion } = trpc.question.getById.useQuery({ id });
	const [selectedId, setSelected] = useState<string>();

	const onSelectChoice = (e: string) => {
		setSelected(e);
	};

	return loadingQuestion ? (
		<div>Loading...</div>
	) : (
		<div>
			<p className="pb-2 text-2xl">Question: {question?.question}</p>
			{question?.choices.map((choice, index) => (
				<ChoiceCard key={index} value={choice.id} selected={choice.id === selectedId} onClick={onSelectChoice}>
					{choice.answer}
				</ChoiceCard>
			))}
		</div>
	);
};

export default QuestionDetails;
