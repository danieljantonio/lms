import axios from 'axios';

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

export const uploadPresignedImage = async (
	presignedUrl: string,
	file?: File,
) => {
	if (file) {
		return await axios
			.put(presignedUrl, file.slice(), {
				headers: { 'Content-Type': file.type },
			})
			.then((res) => {
				console.log(res);
				console.log('Successfully uploaded ', file.name);
			})
			.catch((err) => {
				console.error(err);
			});
	}
};
