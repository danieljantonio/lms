import date from 'date-and-time';

export const validateTestIsOngoing = (dateStart: Date, dateEnd: Date) => {
	const today = new Date().getTime();
	const testOnGoing = today > dateStart.getTime() && today < dateEnd.getTime();
	return testOnGoing;
};

export const validateTestIsOver = (dateEnd: Date) => new Date().getTime() > dateEnd.getTime();

export const validateTestNotStarted = (dateStart: Date) => new Date().getTime() < dateStart.getTime();

export const formatDate = (_date: Date) => {
	return date.format(_date, 'DD MMM,  HH:mm');
};
