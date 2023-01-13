export type ChoiceData = {
	answer: string;
	isCorrectAnswer: boolean;
};

export type ChoiceInputProps = {
	data: ChoiceData;
	removeChoice: () => void;
	setAnswer: (newChoice: ChoiceData) => void;
};

export type ChoiceProps = {
	answer: string;
	isCorrectAnswer: boolean;
};

export type QuestionProps = {
	question: string;
	choice: ChoiceProp[];
};

export type QuestionInputProps = {
	updateQuestion: any;
	index: number;
};
