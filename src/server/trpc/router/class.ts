import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const classRouter = router({
	numberOfClasses: protectedProcedure.query(async ({ ctx }) => {
		const id = ctx.session.user.id;
		const classes = await ctx.prisma.usersOnClasses.findMany({ where: { userId: id, classRole: 'TEACHER' } });
		return classes.length;
	}),
	// createClass: protectedProcedure.input(z.object({})).mutation(async ({ ctx }) => {}),
});
