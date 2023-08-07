export const generateFutureDate = (maxYearsInFuture: number): Date => {
	const today = new Date();
	const maxDate = new Date(
		today.getFullYear() + maxYearsInFuture,
		today.getMonth(),
		today.getDate(),
	);
	return new Date(
		today.getTime() + Math.random() * (maxDate.getTime() - today.getTime()),
	);
};

export const generatePastDate = (maxYearsInPast: number): Date => {
	const today = new Date();
	const maxDate = new Date(
		today.getTime() - maxYearsInPast * 365 * 24 * 60 * 60 * 1000,
	);
	return new Date(
		maxDate.getTime() +
			Math.random() * (today.getTime() - maxDate.getTime()),
	);
};

export const generateLoremIpsum = (numWords: number): string => {
	const loremIpsumWords = [
		'Lorem',
		'ipsum',
		'dolor',
		'sit',
		'amet',
		'consectetur',
		'adipiscing',
		'elit',
		'sed',
		'do',
		'eiusmod',
		'tempor',
		'incididunt',
		'ut',
		'labore',
		'et',
		'dolore',
		'magna',
		'aliqua.',
	];

	let result = '';
	for (let i = 0; i < numWords; i++) {
		const randomIndex = Math.floor(Math.random() * loremIpsumWords.length);
		const word = loremIpsumWords[randomIndex];
		result += word + ' ';
	}

	return result.trim();
};
