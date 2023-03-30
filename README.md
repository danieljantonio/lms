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

[x] Username - Password Login
[ ] Media Upload (via S3)
[ ] Essay Questions
[ ] Simplify school and class code UX
[ ] Import and Export Test & Results
[ ] Pull class data (all tests)

Crucial = Make sure to be able to handle a load for 2000 students.
