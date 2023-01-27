export const shuffleArray = (unshuffled: any[]) => {
	let shuffled = unshuffled
		.map((value) => ({ value, sort: Math.floor(Math.random() * 10) }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);

	return shuffled;
};
