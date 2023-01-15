/*
  Warnings:

  - You are about to drop the column `correctAnswer` on the `MCQQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `wrongAnswers` on the `MCQQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the `EssayQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestAnswer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endDate` to the `MCQQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MCQQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `MCQQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_userId_fkey";

-- DropForeignKey
ALTER TABLE "TestAnswer" DROP CONSTRAINT "TestAnswer_testId_fkey";

-- DropIndex
DROP INDEX "Test_code_key";

-- AlterTable
ALTER TABLE "MCQQuestion" DROP COLUMN "correctAnswer",
DROP COLUMN "wrongAnswers",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "code",
DROP COLUMN "userId";

-- DropTable
DROP TABLE "EssayQuestion";

-- DropTable
DROP TABLE "TestAnswer";

-- CreateTable
CREATE TABLE "MCQChoice" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrectAnswer" BOOLEAN NOT NULL,
    "mCQQuestionId" TEXT,

    CONSTRAINT "MCQChoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MCQChoice" ADD CONSTRAINT "MCQChoice_mCQQuestionId_fkey" FOREIGN KEY ("mCQQuestionId") REFERENCES "MCQQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
