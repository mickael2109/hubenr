/*
  Warnings:

  - The `status` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PrismaLeadStatus" AS ENUM ('NEW', 'CONTACTED', 'RECONTACT', 'APPOINTMENT', 'QUOTESENT');

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "status",
ADD COLUMN     "status" "PrismaLeadStatus" NOT NULL DEFAULT 'NEW';

-- DropEnum
DROP TYPE "public"."LeadStatus";
