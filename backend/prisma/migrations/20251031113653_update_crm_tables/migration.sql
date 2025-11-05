/*
  Warnings:

  - Made the column `startDate` on table `Installation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `Installation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Installation" ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "company" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
