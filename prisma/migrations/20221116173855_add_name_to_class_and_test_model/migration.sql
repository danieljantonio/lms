/*
  Warnings:

  - The values [SUPERADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `name` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT');
ALTER TABLE "UsersOnClasses" ALTER COLUMN "classRole" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "UsersOnClasses" ALTER COLUMN "classRole" TYPE "Role_new" USING ("classRole"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "UsersOnClasses" ALTER COLUMN "classRole" SET DEFAULT 'STUDENT';
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "name" TEXT NOT NULL;
