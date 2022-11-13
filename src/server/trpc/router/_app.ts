import { router } from '../trpc';
import { authRouter } from './auth';
import { classRouter } from './class';
import { schoolRouter } from './school';

export const appRouter = router({
	auth: authRouter,
	school: schoolRouter,
	class: classRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
