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
	choices: ChoiceProp[];
};

export type QuestionInputProps = {
	updateQuestion: any;
	removeQuestion: () => void;
	index: number;
	data?: QuestionProps;
};
