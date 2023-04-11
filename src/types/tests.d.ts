export type ChoiceData = {
	answer: string;
	isCorrect: boolean;
};

export type ChoiceInputProps = {
	data: ChoiceData;
	removeChoice: () => void;
	setAnswer: (newChoice: ChoiceData) => void;
};

export type ChoiceProps = {
	answer: string;
	isCorrect: boolean;
};

export type QuestionProps = {
	question: string;
	choices: ChoiceProp[];
	imageUrl?: string;
	imageFile?: File;
};

export type QuestionInputProps = {
	updateQuestion: (newQuestion: QuestionProps) => void;
	removeQuestion: () => void;
	index: number;
	data?: QuestionProps;
};
