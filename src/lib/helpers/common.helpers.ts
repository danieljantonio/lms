export const shuffleArray = (unshuffled: any[]) => {
	let shuffled = unshuffled
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);

	console.log(shuffled);
	return shuffled;
};
