import { hashPassword } from '@/server/trpc/router/auth';
import type { User } from '@prisma/client';
import { prisma } from '../src/server/db/client';

async function main() {
	// Create School
	const mahanaim = await prisma.school.create({
		data: {
			name: 'Sekolah Mahanaim',
			code: 'MHNM99',
		},
	});

	const marsudirini = await prisma.school.create({
		data: {
			name: 'Marsudirini',
			code: 'MARSUD',
		},
	});

	const hashedPassword = await hashPassword('password');

	// Create Teacher
	const mathTeacher = await prisma.user.create({
		data: {
			username: 'teacher-math',
			password: hashedPassword,
			schoolId: mahanaim.id,
			role: 'TEACHER',
		},
	});

	const englishTeacher = await prisma.user.create({
		data: {
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
		const user = await prisma.user.create({
			data: {
				username: role,
				password: hashedPassword,
				schoolId: mahanaim.id,
			},
		});
		students.push(user);
	});

	// Create classrooms + Classroom students
	const mathClassroom = await prisma.classroom.create({
		data: {
			schoolId: mahanaim.id,
			name: 'Mathematics',
			grade: 7,
			code: 'MATHS7',
			teacherId: mathTeacher.id,
			students: {
				create: students.map((student) => ({ userId: student.id })),
			},
		},
	});

	const englishClassroom = await prisma.classroom.create({
		data: {
			schoolId: mahanaim.id,
			name: 'English',
			grade: 7,
			code: 'ENG4U7',
			teacherId: englishTeacher.id,
			students: {
				create: students.map((student) => ({ userId: student.id })),
			},
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
