/*
  Warnings:

  - You are about to drop the column `isCorrectAnswer` on the `MCQChoice` table. All the data in the column will be lost.
  - Added the required column `isCorrect` to the `MCQChoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MCQChoice" DROP COLUMN "isCorrectAnswer",
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL;
