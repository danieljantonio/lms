import { router } from '../trpc';
import { authRouter } from './auth';
import { classRouter } from './classroom';
import { questionRouter } from './question';
import { s3Router } from './s3';
import { schoolRouter } from './school';
import { studentTestRouter } from './student-test';
import { testRouter } from './tests';

export const appRouter = router({
	auth: authRouter,
	school: schoolRouter,
	classroom: classRouter,
	test: testRouter,
	studentTest: studentTestRouter,
	s3: s3Router,
	question: questionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
