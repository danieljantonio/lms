import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { compare, genSalt, hash } from 'bcrypt';

export const authRouter = router({
	createUser: publicProcedure
		.input(
			z.object({
				name: z.string().optional(),
				username: z.string(),
				password: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { username, name, password } = input;
			const hashedPassword = await hashPassword(password);
			return await ctx.prisma.user.create({
				data: {
					username,
					name: name || username,
					password: hashedPassword,
				},
			});
		}),
});

export const hashPassword = (unhashedPassword: string) => {
	return genSalt(10).then((salt: string) =>
		hash(unhashedPassword, salt).then((hash: string) => hash),
	);
};

export const comparePassword = (
	unhashedPassword: string,
	hashedPassword: string,
) => {
	return compare(unhashedPassword, hashedPassword).then(
		(result: boolean) => result,
	);
};
