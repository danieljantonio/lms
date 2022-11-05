export interface IUser {
	id: string;
	name: string;
	email: string;
	emailVerified: Date;
	image: string;
	schoolId: string;
	classes: [];
	tests: [];
}
