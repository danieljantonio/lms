# Ignosi LMS

A learning management system.

## Technologies

-   [Next-Auth.js](https://next-auth.js.org)
-   [Prisma](https://prisma.io)
-   [TailwindCSS](https://tailwindcss.com)
-   [tRPC](https://trpc.io)

If you are confused, here is some [summarized documentation](https://beta.create.t3.gg) with some summary information and links to the respective documentation.

## Requirements

-   Node v18.15.0
-   NPM 9.5.0
-   PNPM 7.29.1

## How to run

-   `pnpm install`
-   copy `.env.example` to `.env` and populate
-   `pnpm prisma db pull`
-   `pnpm dev`

## Todo

1. Username - Password Login
2. Media Upload (via S3)
3. Essay Questions
4. Simplify school and class code UX
5. Import and Export Test & Results
6. Pull class data (all tests)

Crucial = Make sure to be able to handle a load for 2000 students.
