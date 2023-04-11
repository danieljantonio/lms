import { ChangeEvent, FC, useEffect, useState } from 'react';
import { ChoiceData, ChoiceProps, QuestionInputProps } from '@/types/tests';
import ChoiceInput from './choice-input.tests';
import { XCircle } from '@phosphor-icons/react';

const QuestionInput: FC<QuestionInputProps> = ({
	index,
	updateQuestion,
	data,
	removeQuestion,
}) => {
	const [question, setQuestion] = useState<string>(data?.question || '');
	const [loading, setLoading] = useState(false);
	const [choices, setChoices] = useState<ChoiceProps[]>(data?.choices || []);
	const [image, setImage] = useState<File | undefined>(data?.imageFile);
	const [previewImage, setPreviewImage] = useState<string | undefined>(
		data?.imageUrl,
	);

	const addNewChoice = async () => {
		setLoading(true);
		const qc = choices;
		qc.push({
			answer: '',
			isCorrect: false,
		});
		await setChoices(qc);
		setLoading(false);
	};

	const removeChoice = async (index: number) => {
		setLoading(true);
		const qc = choices;
		qc.splice(index, 1);
		await setChoices(qc);
		setLoading(false);
	};

	useEffect(() => {
		console.log('useEffect', data);

		updateQuestion({
			question,
			choices,
			imageFile: image,
			imageUrl: previewImage,
		});
	}, [choices, question, image]);

	const updateAnswer = async (newChoice: ChoiceData, index: number) => {
		let _qc = choices;
		if (newChoice.isCorrect) {
			setLoading(true);
			_qc = await _qc.map((choice) => {
				choice.isCorrect = false;
				return choice;
			});
			setLoading(false);
		}
		_qc[index] = newChoice;
		await setChoices(_qc);
	};

	const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;

		if (files?.length === 1) {
			console.log(files[0]);
			const previewImage = URL.createObjectURL(files[0] as Blob);
			setPreviewImage(previewImage);
			setImage(files[0]);
		}
	};

	const clearImage = () => {
		setPreviewImage(undefined);
		setImage(undefined);
	};

	return (
		<div className="card border mt-4">
			<div className="relative card-body">
				<label className="label text-sm pl-0">
					Question {index + 1}
				</label>
				{previewImage ? (
					<div className="w-fit mx-auto relative">
						<img
							src={previewImage}
							alt="Uploaded Image"
							className="max-h-52"
						/>
						<span
							className="absolute btn btn-xs btn-error btn-circle -right-2 -top-2"
							onClick={() => clearImage()}>
							x
						</span>
					</div>
				) : null}
				<input
					value={question}
					type="text"
					placeholder={`Question ${index + 1}`}
					className="input input-bordered w-full"
					onChange={(e) => setQuestion(e.target.value)}
				/>
				<XCircle
					size={24}
					weight="fill"
					onClick={removeQuestion}
					className="absolute right-4 top-4 mx-auto w-5 text-gray-500 hover:cursor-pointer hover:text-gray-800"
				/>
				{loading ? (
					<div>Loading...</div>
				) : (
					choices.map((questionChoice, index) => {
						return (
							<ChoiceInput
								key={index}
								data={questionChoice}
								setAnswer={(newChoice) => {
									updateAnswer(newChoice, index);
								}}
								removeChoice={() => removeChoice(index)}
							/>
						);
					})
				)}
				<div className="card-actions justify-end">
					{previewImage ? null : (
						// <button
						// 	className="btn btn-warning"
						// 	onClick={clearImage}>
						// 	Remove Image
						// </button>
						<input
							onChange={(e) => handleImage(e)}
							type="file"
							accept="image/jpeg, image/png, image/jpg"
							className="file-input file-input-bordered file-input-info w-full max-w-xs"
						/>
					)}
					<button
						className="btn btn-info text-white"
						onClick={addNewChoice}
						disabled={choices.length >= 4}>
						Add Choice
					</button>
					<button className="btn" onClick={() => console.log(data)}>
						log
					</button>
				</div>
			</div>
		</div>
	);
};

export default QuestionInput;
