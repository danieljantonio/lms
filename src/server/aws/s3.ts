import { S3 } from '@aws-sdk/client-s3';
import { env } from '@/lib/env/server.mjs';

export const s3 = new S3({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	},
});
