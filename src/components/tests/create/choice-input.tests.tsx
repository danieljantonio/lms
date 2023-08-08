import { Check, X } from '@phosphor-icons/react';
import { useState, type FC } from 'react';

export interface ChoiceInputProps {
	choice: string;
	isCorrect: boolean;
	onChange: (data: string, isCorrect?: boolean) => void;
	onRemove: () => void;
}

const ChoiceInput: FC<ChoiceInputProps> = ({
	choice,
	isCorrect,
	onChange,
	onRemove,
}) => {
	const [text, setText] = useState(choice);
	return (
		<div className="join">
			<button
				className={`btn btn-square join-item btn-success ${
					isCorrect ? '' : 'btn-outline'
				}`}
				onClick={() => onChange(text, true)}
				type="button">
				<Check weight="bold" size={18} />
			</button>
			<input
				defaultValue={text}
				type="text"
				placeholder="Multiple Choice"
				className={`input input-bordered join-item w-full ${
					isCorrect ? 'outline-success' : ''
				}`}
				onChange={(e) => setText(e.target.value)}
				onBlur={() => onChange(text)}
			/>
			<button
				onClick={onRemove}
				className="btn btn-square btn-error btn-outline join-item"
				type="button">
				<X weight="bold" size={18} />
			</button>
		</div>
	);
};

export default ChoiceInput;
