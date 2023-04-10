import { RouterTypes, trpc } from '@/lib/trpc';
import { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

const TakeTest: NextPage = () => {
	const [questionNo, _setQuestionNo] = useState(1);

	const router = useRouter();
	const { testId } = router.query;

	const utils = trpc.useContext();

	const { data: test, isLoading } = trpc.studentTest.get.useQuery(
		{
			testId: testId as string,
		},
		{ refetchOnWindowFocus: false },
	);

	const answer = trpc.studentTest.updateQuestion.useMutation({
		onSuccess: (data) => {
			utils.studentTest.getQuestion.invalidate({
				questionOrder: data.questionOrder,
				studentTestId: data.studentTestId,
			});
		},
	});

	if (isLoading) return <div>Loading...</div>;
	if (!test) return <div>Failed to fetch test data</div>;

	const questionNumbers = () => {
		const arr = [];
		for (let i = 0; i < test.questionCount; i++) {
			arr.push(i + 1);
		}
		return arr;
	};

	const setQuestionNo = (num: number) => {
		if (!(num > 0 && num <= test.questionCount)) return;
		_setQuestionNo(num);
	};

	return (
		<div className="flex w-full flex-col text-center">
			<div className="mb-4">
				<p className="mx-auto text-3xl font-semibold">
					{/* Countdown Timer */}
					{/* Test Stats */}

					{/* Question and Answer */}
					{test.testTemplate.name}
				</p>
				<p className="text-lg">
					Question {questionNo} of {test.questionCount}
				</p>
			</div>
			<RenderQuestion
				updateIsLoading={answer.isLoading}
				answerQuestion={(data) => answer.mutate(data)}
				questionOrder={questionNo}
				studentTestId={test.id}
			/>
			<div className="input-group w-fit mx-auto mt-4">
				<button
					className="btn"
					onClick={() => setQuestionNo(questionNo - 1)}
					disabled={questionNo === 1}>
					«
				</button>
				<select
					value={questionNo}
					className="select select-bordered"
					onChange={(e) => setQuestionNo(parseInt(e.target.value))}>
					{questionNumbers().map((qNo) => (
						<option value={qNo}>Q{qNo}</option>
					))}
				</select>
				<button
					className="btn"
					onClick={() => setQuestionNo(questionNo + 1)}
					disabled={questionNo === test.questionCount}>
					»
				</button>
			</div>
		</div>
	);
};

type RenderQuestionProps = {
	questionOrder: number;
	studentTestId: string;
	updateIsLoading: boolean;
	answerQuestion: (
		data: RouterTypes['studentTest']['updateQuestion']['input'],
	) => void;
};

const RenderQuestion = ({
	questionOrder,
	studentTestId,
	answerQuestion,
	updateIsLoading,
}: RenderQuestionProps) => {
	const [selected, setSelected] = useState<string>();
	const [mounted, setMounted] = useState<boolean>(false);

	const { data, isLoading } = trpc.studentTest.getQuestion.useQuery(
		{
			questionOrder,
			studentTestId,
		},
		{ refetchOnWindowFocus: false },
	);

	useEffect(() => {
		if (data?.chosenAnswerId) {
			setSelected(data.chosenAnswerId);
			setMounted(true);
		}
	}, [data]);

	if (isLoading || !data || !mounted)
		return (
			<div className="card border w-full h-56">
				<div className="loading m-auto">Loading...</div>
			</div>
		);

	return (
		<div className="card border">
			<div className="card-body">
				<p className="text-xl">{data.question.question}</p>
				{data.question.choices.map(({ id, answer }) => (
					<button
						key={id}
						onClick={() => {
							setSelected(id);
							answerQuestion({
								chosenAnswerId: id,
								studentTestId,
								questionId: data.questionId,
							});
						}}
						className={`btn no-animation ${
							selected === id ? '' : 'btn-outline'
						} ${updateIsLoading ? 'btn-disabled' : ''}`}>
						{answer}
					</button>
				))}
			</div>
		</div>
	);
};

export default TakeTest;
