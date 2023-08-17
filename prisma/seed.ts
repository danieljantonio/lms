import { hashPassword } from '@/server/trpc/router/auth';
import type { User } from '@prisma/client';
import { prisma } from '../src/server/db/client';
import {
	generateFutureDate,
	generateLoremIpsum,
	generatePastDate,
} from './helpers/seed.helpers';

async function main() {
	// Create School
	const mahanaim = await prisma.school.upsert({
		where: {
			code: 'MHNM99',
		},
		update: {},
		create: {
			name: 'Sekolah Mahanaim',
			code: 'MHNM99',
		},
	});

	const marsudirini = await prisma.school.upsert({
		where: {
			code: 'MARSUD',
		},
		update: {},
		create: {
			name: 'Marsudirini',
			code: 'MARSUD',
		},
	});

	const hashedPassword = await hashPassword('password');

	// Create Teacher
	const mathTeacher = await prisma.user.upsert({
		where: { username: 'teacher-math' },
		update: {},
		create: {
			username: 'teacher-math',
			password: hashedPassword,
			schoolId: mahanaim.id,
			role: 'TEACHER',
		},
	});

	const englishTeacher = await prisma.user.upsert({
		where: { username: 'teacher-english' },
		update: {},
		create: {
			username: 'teacher-english',
			password: hashedPassword,
			schoolId: mahanaim.id,
			role: 'TEACHER',
		},
	});

	// Create students
	const roles = ['student-1', 'student-2', 'student-3'];
	const students: User[] = [];

	roles.forEach(async (role) => {
		const user = await prisma.user.upsert({
			where: {
				username: role,
			},
			update: {},
			create: {
				username: role,
				password: hashedPassword,
				schoolId: mahanaim.id,
			},
		});
		students.push(user);
	});

	// Create classrooms + Classroom students
	const mathClassroom = await prisma.classroom.upsert({
		where: {
			code: 'MATHS7',
		},
		update: {},
		create: {
			schoolId: mahanaim.id,
			name: 'Mathematics',
			grade: 7,
			code: 'MATHS7',
			teacherId: mathTeacher.id,
		},
	});

	const englishClassroom = await prisma.classroom.upsert({
		where: {
			code: 'ENG4U7',
		},
		update: {},
		create: {
			schoolId: mahanaim.id,
			name: 'English',
			grade: 7,
			code: 'ENG4U7',
			teacherId: englishTeacher.id,
		},
	});

	// Put students into tests
	students.forEach(async (student) => {
		await prisma.classroomStudents.upsert({
			where: {
				classroomId_userId: {
					userId: student.id,
					classroomId: englishClassroom.id,
				},
			},
			update: {},
			create: {
				userId: student.id,
				classroomId: englishClassroom.id,
			},
		});

		await prisma.classroomStudents.upsert({
			where: {
				classroomId_userId: {
					userId: student.id,
					classroomId: mathClassroom.id,
				},
			},
			update: {},
			create: {
				userId: student.id,
				classroomId: mathClassroom.id,
			},
		});
	});

	const description =
		'This test requires you to understand the basic fundamentals of the course. Most topics from this week will be shown.';

	const qNo = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
		21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
	];

	// create tests and generate questions with choices
	const dailyQuiz1Questions: { id: string }[] = await generateQuestions(10);

	await prisma.test.create({
		data: {
			classroomId: englishClassroom.id,
			startDate: generatePastDate(8),
			endDate: generatePastDate(1),
			duration: 45,
			name: 'Daily Quiz - Week 1',
			passcode: 'passcode',
			description,
			questions: { connect: dailyQuiz1Questions },
		},
	});

	const dailyQuiz2Questions: { id: string }[] = await generateQuestions(10);

	await prisma.test.create({
		data: {
			classroomId: englishClassroom.id,
			startDate: generateFutureDate(0),
			endDate: generateFutureDate(7),
			duration: 45,
			name: 'Daily Quiz - Week 2',
			passcode: 'passcode',
			description,
			questions: { connect: dailyQuiz2Questions },
		},
	});

	const dailyQuiz3Questions: { id: string }[] = await generateQuestions(10);

	await prisma.test.create({
		data: {
			classroomId: englishClassroom.id,
			startDate: generateFutureDate(7),
			endDate: generateFutureDate(14),
			duration: 45,
			name: 'Daily Quiz - Week 3',
			passcode: 'passcode',
			description,
			questions: { connect: dailyQuiz3Questions },
		},
	});

	const monthlyTestQuestions: { id: string }[] = await generateQuestions(40);

	await prisma.test.create({
		data: {
			classroomId: englishClassroom.id,
			startDate: generatePastDate(3),
			endDate: generateFutureDate(4),
			duration: 120,
			name: 'Monthly Test',
			passcode: 'passcode',
			description,
			questions: {
				connect: monthlyTestQuestions,
			},
		},
	});
}

async function generateQuestions(amount: number) {
	const questions: { id: string }[] = [];

	for (let i = 0; i < amount; i++) {
		const question = await generateQuestion(
			4,
			Math.floor(Math.random() * 10) === 0,
			Math.floor(Math.random() * 20) === 0,
		);
		questions.push({ id: question });
	}

	return questions;
}

async function generateQuestion(
	choice = 4,
	isEssay?: boolean,
	hasImage?: boolean,
) {
	const choicesData = [];

	for (let index = 0; index < choice; index++) {
		choicesData.push({
			choice: generateLoremIpsum(5 + Math.floor(Math.random() * 20)),
			isCorrect: index === 0,
		});
	}

	const newQuestion = await prisma.question.create({
		data: {
			question: generateLoremIpsum(10 + Math.floor(Math.random() * 30)),
			isEssay,
			image: hasImage
				? 'https://pbs.twimg.com/media/F3A2njiakAAe60w?format=jpg&name=large'
				: undefined,
			choices: {
				createMany: {
					data: choicesData,
				},
			},
		},
	});

	return newQuestion.id;
}

main()
	.then(async () => {
		await prisma.$disconnect();
		console.log('DB has been seeded');
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
