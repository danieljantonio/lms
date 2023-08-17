import { protectedProcedure, router } from '../trpc';

import { z } from 'zod';

export const questionRouter = router({
	getQuestions: protectedProcedure
		.input(z.object({ testId: z.string() }))
		.query(async ({ ctx, input }) => {
			const questions = await ctx.prisma.question.findMany({
				where: { testId: input.testId },
				include: {
					choices: true,
				},
			});

			return questions;
		}),
	createQuestion: protectedProcedure
		.input(
			z.object({
				testId: z.string(),
				question: z.object({
					question: z.string(),
					correctChoice: z.string().optional(),
					choices: z.array(z.string()),
					hasImage: z.boolean(),
				}),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// const newQuestion = await ctx.prisma.question.create({
			// 	data: {
			// 		testId: input.testId,
			// 		...input.question,
			// 	},
			// });
			// return newQuestion;
		}),
	updateQuestion: protectedProcedure
		.input(
			z.object({
				questionId: z.string(),
				question: z.object({
					question: z.string().optional(),
					choices: z
						.array(
							z.object({
								id: z.string().optional(),
								choice: z.string(),
								isCorrect: z.boolean(),
							}),
						)
						.optional(),
					image: z.string().optional(),
					isEssay: z.boolean().optional(),
				}),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { choices } = input.question;
			const choiceUpsert = choices
				? choices.map(({ id, choice, isCorrect }) => {
						return {
							where: { id: id ? id : 'undefined' },
							update: {
								choice,
								isCorrect,
							},
							create: {
								choice,
								isCorrect,
							},
						};
				  })
				: [];

			console.log(choiceUpsert);

			const updateQuestion = await ctx.prisma.question.update({
				where: { id: input.questionId },
				data: {
					...input.question,
					choices: { upsert: choiceUpsert },
				},
			});

			return updateQuestion;
		}),
});
