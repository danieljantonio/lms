import { router } from '../trpc';
import { authRouter } from './auth';
import { classRouter } from './classroom';
import { schoolRouter } from './school';
import { testRouter } from './tests';

export const appRouter = router({
	auth: authRouter,
	school: schoolRouter,
	classroom: classRouter,
	test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
