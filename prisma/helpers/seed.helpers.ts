export const generateFutureDate = (maxDaysInFuture: number): Date => {
	const today = new Date();
	const maxDate = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + maxDaysInFuture,
	);
	return new Date(
		today.getTime() + Math.random() * (maxDate.getTime() - today.getTime()),
	);
};

export const generatePastDate = (maxDaysInPast: number): Date => {
	const today = new Date();
	const maxDay = new Date(
		today.getTime() - maxDaysInPast * 24 * 60 * 60 * 1000,
	);

	return new Date(
		maxDay.getTime() + Math.random() * (today.getTime() - maxDay.getTime()),
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
