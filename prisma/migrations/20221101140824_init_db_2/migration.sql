/*
  Warnings:

  - The `wrongAnswers` column on the `MCQQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MCQQuestion" DROP COLUMN "wrongAnswers",
ADD COLUMN     "wrongAnswers" TEXT[];
