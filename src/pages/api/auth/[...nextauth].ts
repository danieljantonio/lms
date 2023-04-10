import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { prisma } from '@/server/db/client';
import { comparePassword } from '@/server/trpc/router/auth';

export const authOptions: NextAuthOptions = {
	session: { strategy: 'jwt' },
	secret: process.env.NEXTAUTH_SECRET,
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: {
					label: 'Username',
					type: 'text',
					placeholder: 'Andy Smith',
				},
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials, req) => {
				const { username, password } = credentials as {
					username: string;
					password: string;
				};
				const user = await prisma.user.findFirstOrThrow({
					where: { username },
				});

				if (!user) return null;

				if (!(await comparePassword(password, user.password)))
					return null;

				user.password = '';

				return user;
			},
		}),
	],
	pages: {
		signIn: '/auth/signin',
		newUser: '/auth/signiup',
	},
	callbacks: {
		async session({ session, token }) {
			if (session.user) {
				const user = await prisma.user.findUniqueOrThrow({
					where: { id: token.sub },
				});

				session.user.id = user.id;
				session.user.role = user.role;
				session.user.username = user.username;
				if (user.schoolId) session.user.schoolId = user.schoolId;
			}

			return session;
		},
	},
};

export default NextAuth(authOptions);
