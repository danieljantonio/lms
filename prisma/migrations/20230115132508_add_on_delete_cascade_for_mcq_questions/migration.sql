-- DropForeignKey
ALTER TABLE "MCQChoice" DROP CONSTRAINT "MCQChoice_questionId_fkey";

-- AddForeignKey
ALTER TABLE "MCQChoice" ADD CONSTRAINT "MCQChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MCQQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
