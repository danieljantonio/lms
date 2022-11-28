/*
  Warnings:

  - You are about to drop the column `classId` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersOnClasses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `classroomId` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_classId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnClasses" DROP CONSTRAINT "UsersOnClasses_classId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnClasses" DROP CONSTRAINT "UsersOnClasses_userId_fkey";

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "classId",
ADD COLUMN     "classroomId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "UsersOnClasses";

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnClassrooms" (
    "classroomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classroomRole" "Role" NOT NULL DEFAULT 'STUDENT',

    CONSTRAINT "UsersOnClassrooms_pkey" PRIMARY KEY ("classroomId","userId")
);

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnClassrooms" ADD CONSTRAINT "UsersOnClassrooms_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnClassrooms" ADD CONSTRAINT "UsersOnClassrooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
