import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { env } from '@/lib/env/server.mjs';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3Router = router({
	getObjects: protectedProcedure
		.input(
			z.object({
				prefix: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { s3 } = ctx;

			const listObjectsOutput = await s3.listObjectsV2({
				Bucket: env.AWS_BUCKET_NAME,
				Prefix: input.prefix,
			});

			return listObjectsOutput.Contents ?? [];
		}),
	getStandardUploadPresignedUrl: protectedProcedure
		.input(
			z.object({
				key: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { key } = input;
			const { s3 } = ctx;

			const putObjectCommand = new PutObjectCommand({
				Bucket: env.AWS_BUCKET_NAME,
				Key: key,
			});

			return await getSignedUrl(s3, putObjectCommand);
		}),
});
