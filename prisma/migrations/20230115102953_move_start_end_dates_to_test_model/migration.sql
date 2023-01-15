/*
  Warnings:

  - You are about to drop the column `mCQQuestionId` on the `MCQChoice` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `MCQQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `MCQQuestion` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MCQChoice" DROP CONSTRAINT "MCQChoice_mCQQuestionId_fkey";

-- AlterTable
ALTER TABLE "MCQChoice" DROP COLUMN "mCQQuestionId",
ADD COLUMN     "questionId" TEXT;

-- AlterTable
ALTER TABLE "MCQQuestion" DROP COLUMN "endDate",
DROP COLUMN "startDate";

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "MCQChoice" ADD CONSTRAINT "MCQChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MCQQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
