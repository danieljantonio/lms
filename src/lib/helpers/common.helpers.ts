export const shuffleArray = (unshuffled: any[]) => {
	const shuffled = unshuffled
		.map((value) => ({ value, sort: Math.floor(Math.random() * 10) }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);

	return shuffled;
};

export const getScorePct = (score: number) => {
	return (score * 100).toFixed(2);
};
